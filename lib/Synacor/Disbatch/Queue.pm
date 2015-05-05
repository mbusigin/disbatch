package Synacor::Disbatch::Queue;

use 5.12.0;
use warnings;

use Carp;
use Data::Dumper;
use JSON -convert_blessed_universally;
use POSIX ();
use Synacor::Disbatch::Engine;
use Try::Tiny;

sub new {
    my ($class, $maxthreads) = @_;

    my $self = {
        tasks_doing   => [],
        maxthreads    => $maxthreads,
        threads       => [],
        threads_inuse => {},
        preemptive    => 1,
        lastthreadid  => 0,
        name          => '',
        constructor   => '',
        config        => $Synacor::Disbatch::Engine::Engine->{config},
    };

    bless $self, $class;
}

sub find_next_task {
    my ($self, $node) = @_;
    die 'No node' unless defined $node;

    $self->{sort} //= 'default';
    #$self->logger->trace("Synacor::Disbatch::Queue->find_next_task() $self->{id} current sort order: $self->{sort}");

    my $command = [
        query  => { node => -1, status => -2, queue => $self->{id} },		# FIXME: can this be an ARRAY or a Tie::IxHash?
        update => { '$set' => {node => $node, status => 0, mtime => time} }
    ];

    if ($self->{sort} eq 'fifo') {
        push @$command, 'sort', { _id => 1 };
    } elsif ($self->{sort} eq 'lifo') {
        push @$command, 'sort', { _id => -1 };
    } elsif ($self->{sort} ne 'default') {
        $self->logger->trace("Synacor::Disbatch::Queue->find_next_task() $self->{id} unknown sort order '$self->{sort}' -- using default");
    }

    $Synacor::Disbatch::Backend::mongo->get_collection($self->{engine}{config}{tasks_collection})->find_and_modify($command);
}

sub schedule {
    my ($self) = @_;

    my $node         = $self->{engine}{config}{node};
    my $free_threads = $self->{maxthreads} - @{$self->{tasks_doing}};
    #$self->wtfer->trace("schedule free_threads: $free_threads, maxthreads: $self->{maxthreads}, tasks_doing: " . scalar @{$self->{tasks_doing}});

    for (my $x = 0; $x < $free_threads; $x++) {
        my $document = $self->find_next_task($node);
        #$self->wtfer->trace("schedule found no more free tasks") unless defined $document;
        return unless $document;
        $self->wtfer->trace("schedule loading task: $document->{_id}");
        my $task = $self->load_task($document);
        $self->wtfer->trace("schedule finding a free thread for $document->{_id}");
        my $thr = $self->get_free_thread();
        $self->{threads_inuse}{$task->{id}} = $thr;
        $self->wtfer->trace("schedule starting actual task: $document->{_id}");
        $thr->{eb}->call_thread('start_task', $task);
        push @{$self->{tasks_doing}}, $task;
    }
    1;
}

sub create_task {
    my ($self, $parameters) = @_;

    $self->logger->trace("Synacor::Disbatch::Queue->create_task()");

    my $task = try {
        $self->create_task_actual($parameters);
    }
    catch {
        $self->logger->error("Error creating task: $_");
        undef;
    };

    my $obj = {
        queue      => $self->{id},
        status     => -2,
        stdout     => '',
        stderr     => '',
        node       => -1,
        parameters => $self->{engine}{parameterformat_write}($parameters),
        ctime      => time,
        mtime      => time,
    };

    Synacor::Disbatch::Backend::update_collection($self->{engine}{config}{queues_collection}, {_id => $self->{id}}, {'$inc' => {count_total => 1, count_todo => 1}});
    my $id = Synacor::Disbatch::Backend::insert_collection($self->{engine}{config}{tasks_collection}, $obj, {retry => 'synchronous'});
    $obj->{_id} = $obj->{id} = $id;    # FIXME: i doubt this does anything
    $task;
}

sub parameters_definitions {
    $_[0]->parameters_definitions;
}

sub queue_parameters {
    $_[0]->queue_parameters;
}

my $update_tasks_sth = undef;

sub report_task_done {
    my ($self, $taskid, $status, $stdout, $stderr) = @_;

    $self->wtfer->trace("report_task_done: $taskid");

    # TODO: replace for/if blocks with a grep?
    for (my $x = 0; $x < @{$self->{tasks_doing}}; $x++) {
        if ($self->{tasks_doing}[$x]{_id}->to_string eq $taskid) {
            $self->wtfer->trace("report_task_done removing from tasks_doing: $taskid");
            my $task = $self->{tasks_doing}[$x];
            splice @{$self->{tasks_doing}}, $x, 1;
            my $thr = $self->{threads_inuse}{$taskid};
            $self->logger->error("wtf - no thread for $self $taskid $status $stdout $stderr") unless $thr;
            $thr->{tasks_run}++;
            if ($self->{config}{tasks_before_workerthread_retirement} != 0 and $thr->{tasks_run} >= $self->{config}{tasks_before_workerthread_retirement}) {
                $self->logger->info("Worker thread is retiring after $thr->{tasks_run} tasks");
                $self->{threads_inuse}{$taskid}{eb}->call_thread('retire');
                POSIX::close($self->{threads_inuse}{$taskid}{eb}{socket}->fileno);
                delete $self->{threads_inuse}{$taskid};
                $self->start_thread_pool;
            } else {
                push @{$self->{threads}}, delete $self->{threads_inuse}{$taskid};
            }
            $self->logger->info("taskid: $taskid;  stderr: $stderr;  status: $status");
            # this is really important to be set, in case there's a problem with setting stdout or stderrr:
            Synacor::Disbatch::Backend::update_collection($self->{engine}{config}{tasks_collection}, {_id => $taskid}, {'$set' => {status => $status}}, {}, { retry => 'synchronous' });

            if (! Synacor::Disbatch::Backend::update_collection($self->{engine}{config}{tasks_collection}, {_id => $taskid}, {'$set' => {stdout => $stdout, stderr => $stderr}}) ) {
                Synacor::Disbatch::Backend::update_collection($self->{engine}{config}{tasks_collection}, {_id => $taskid}, {'$set' => {stdout => 'STDOUT too large for MongoDB', stderr => $stderr}})
            }

            Synacor::Disbatch::Backend::update_collection($self->{engine}{config}{queues_collection}, {_id => $self->{id}}, {'$inc' => {count_todo => -1}});
            $self->wtfer->trace("report_task_done calling schedule again after finishing task: $taskid");
            $self->schedule if $self->{preemptive};
            return;
        }
    }
    $self->logger->error("!! Synacor::Disbatch::Queue->report_task_done() called on invalid taskid #$taskid");
}

sub start_thread_pool {
    my ($self) = @_;

    if ($self->{engine}->is_active_queue($self->{id}) == 0) {
        $self->logger->error("No threads for $self->{id}");
        return 0;
    }

    my $threads = @{$self->{threads}} + keys %{$self->{threads_inuse}};
    my $nt      = $self->{maxthreads} - $threads;
    for (my $x = 0; $x < $nt; $x++) {
        $self->{lastthreadid}++;
        my $worker = Synacor::Disbatch::WorkerThread->new($self->{lastthreadid}, $self);
        push @{$self->{threads}}, $worker;
        $self->logger->trace("pushed $worker");
    }
    $nt;
}

sub get_free_thread {
    pop @{$_[0]->{threads}};
}

# NOTE: unused
# FIXME: use cursor and not ->all
sub load_tasks {
    my ($self) = @_;

    my @tasks = $Synacor::Disbatch::Engine::mongo->get_collection('tasks')->query({queue => $self->{id}})->all;
    for my $document (@tasks) {
        my $parameters = $self->{engine}{parameterformat_read}($document->{parameters}) if $document->{parameters};
        $self->create_task_actual($parameters);
    }
}

sub load_task {
    my ($self, $document) = @_;

    my $parameters = $self->{engine}{parameterformat_read}($document->{parameters}) if $document->{parameters};
    my $task = $self->create_task_actual($parameters);
    $self->logger->error("Couldn't create task!  Parameters: " . Dumper($parameters) . "\n" . "document: " . Dumper $document) unless $task;
    $task->{id} = $task->{_id} = $document->{_id};
    $task;
}

sub count_todo {
    my ($self) = @_;

    my $r = Synacor::Disbatch::Backend::query_one($self->{engine}{config}{queues_collection}, {_id => $self->{id}});
    my $v = 0;
    if (defined $r and defined $r->{count_todo}) {
        $v = $r->{count_todo};
    } else {
        $v = Synacor::Disbatch::Backend::count($self->{engine}{config}{tasks_collection}, [queue => $self->{id}, status => -2]);
        Synacor::Disbatch::Backend::update_collection($self->{engine}{config}{queues_collection}, {_id => $self->{id}}, {'$set' => {count_todo => $v}});
    }
    $v;
}

sub count_total {
    my ($self) = @_;

    my $r = Synacor::Disbatch::Backend::query_one($self->{engine}{config}{queues_collection}, {_id => $self->{id}});
    my $v = 0;
    if (defined $r and defined $r->{count_total}) {
        $v = $r->{count_total};
    } else {
        $v = Synacor::Disbatch::Backend::count($self->{engine}{config}{tasks_collection}, {queue => $self->{id}});
        Synacor::Disbatch::Backend::update_collection($self->{engine}{config}{queues_collection}, {_id => $self->{id}}, {'$set' => {count_total => $v}});
    }
    $v;
}

sub logger {
    my ($self, $logger) = @_;
    my $classname = ref $self;
    $classname =~ s/^.*:://;

    $logger = defined $logger ? "disbatch.plugins.$classname.$logger" : "disbatch.plugins.$classname";

    if (!$self->{log4perl_initialised}) {
        Log::Log4perl::init($self->{config}{log4perl_conf});
        $self->{log4perl_initialised} = 1;
        $self->{loggers}              = {};
    }

    return $self->{loggers}{$logger} if $self->{loggers}{$logger};
    $self->{loggers}{$logger} = Log::Log4perl->get_logger($logger);
    $self->{loggers}{$logger};
}

sub wtfer {
    my ($self) = @_;

    my $logger = 'disbatch.wtf';

    if (!$self->{log4perl_initialised}) {
        Log::Log4perl::init($self->{config}{log4perl_conf});
        $self->{log4perl_initialised} = 1;
        $self->{loggers}              = {};
    }

    return $self->{loggers}{$logger} //= Log::Log4perl->get_logger($logger);
}

1;

__END__

=head1 NAME

Synacor::Disbatch::Queue - the base class for a migration queue.  This
contains the housekeeping functions, and encapsulates
Synacor::Disbatch::Task objects which do the actual work.


=head1 METHODS

=over 1

=item new()

Creates new Synacor::Disbatch::Queue.

Arguments:

  $maxthreads		The maximum number of concurrent threads

=item find_next_task($node)

   This method finds the next task to schedule.  It is overridable by plugin classes
   for custom scheduler algorithms.

=item schedule()

  This method decides when to spin up new threads, using a very simple
  algorithm which simply attempts to saturate **maxthreads** with work.

=item create_task_actual()

Virtual/stub method which Queue implementors must override to provide to create
the new queue.  View Synacor::Disbatch::Queue::IMAP2IMAP as an example.

=item create_task()

Create an task using the create_task_actual() virtual/stub method, and save
it to the database.

=item parameters_definitions()

Reports back an arrayref containing hashrefs of task parameter definitions.

    [
        { name => 'foo', type => 'int', default => 1, description => 'unnecessary' },
    ]

=item queue_parameters()

Reports back an arrayref containing hashrefs of queue parameter definitions.

    [
        { name => 'foo', type => 'int', default => 1, description => 'unnecessary' },
    ]

=item report_task_done()

Reports that an task for this queue is complete.  This is useful information
for the scheduler.

Parameters:

  $taskid		completed task ID

