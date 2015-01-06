package Synacor::Disbatch::Engine;

use 5.12.0;
use warnings;

use Carp;
use Data::Dumper;
use DateTime;
use JSON -convert_blessed_universally;
use Log::Log4perl;
use MongoDB;
use Pinscher::Core::EventBus;
use Storable qw(thaw nfreeze);
use Synacor::Disbatch::Backend;
use Synacor::Disbatch::ChunkedTaskFactory;
use Synacor::Disbatch::WorkerThread;
use Try::Tiny;

$Storable::interwork_56_64bit = 1;

# used in Synacor::Disbatch::Backend, Synacor::Disbatch::HTTP, Synacor::Disbatch::Queue, and Synacor::Disbatch::WorkerThread
our $EventBus;
our $Engine;

sub new {
    my ($class, $config) = @_;

    $config->{tasks_collection}  //= 'tasks';
    $config->{queues_collection} //= 'queues';

    my $self = {
        queues               => [],
        queue_constructors   => {},
        config               => $config,
        reloadqueues         => 0,
        chunkedtaskfactories => [],
        task_observers       => {},
    };

    bless $self, $class;

    # Configure event bus
    $self->{eb} = Pinscher::Core::EventBus->new($self, 'Synacor::Engine');
    $self->{eb}{methods}{awaken}                           = \&awaken;
    $self->{eb}{methods}{scheduler_report}                 = \&scheduler_report;
    $self->{eb}{methods}{set_queue_attr}                   = \&set_queue_attr;
    $self->{eb}{methods}{construct_queue}                  = \&construct_queue;
    $self->{eb}{methods}{queue_create_tasks}               = \&queue_create_tasks;
    $self->{eb}{methods}{queue_create_tasks_from_query}    = \&queue_create_tasks_from_query;
    $self->{eb}{methods}{queue_prototypes}                 = \&queue_prototypes;
    $self->{eb}{methods}{search_tasks}                     = \&search_tasks;
    $self->{eb}{methods}{delete_queue}                     = \&delete_queue;
    $self->{eb}{procedures}{report_task_done}              = \&report_task_done;
    $self->{eb}{procedures}{update_node_status}            = \&update_node_status;
    $self->{eb}{procedures}{reload_queues}                 = \&reload_queues;
    $self->{eb}{procedures}{register_task_status_observer} = \&register_task_status_observer;

    Synacor::Disbatch::Backend::initialise($config->{mongohost}, $config->{mongodb}, $config->{mongouser}, $config->{mongopassword}, $config->{tasks_collection}, $config->{queues_collection});

    $Engine = $self;
    $EventBus = $self->{eb};

    $self->orphan_tasks;

    $self;
}

sub orphan_tasks {
    my $self = shift or die "No self";
    Synacor::Disbatch::Backend::update_collection(
        $self->{config}{tasks_collection},
        {node => $self->{config}{node}, status => 0},
        {'$set' => {status => -6}}, {multiple => 1}
    );
}

sub logger {
    my ($self, $type) = @_;
    my $logger = defined $type ? "disbatch.engine.$type" : 'disbatch.engine';

    unless ($self->{log4perl_initialised}) {
        Log::Log4perl::init($self->{config}{log4perl_conf});
        $self->{log4perl_initialised} = 1;
        $self->{loggers}              = {};
    }

    $self->{loggers}{$logger} //= Log::Log4perl->get_logger($logger);
    $self->{loggers}{$logger};
}

sub add_queue {
    my ($self, $queue) = @_;

    push @{$self->{queues}}, $queue;
    $queue->{id} = $self->{_id};
}

sub start {
    $_[0]->{eb}->run;
}

sub awaken {
    my ($self) = @_;

    for my $queue (@{$self->{queues}}) {
        $queue->schedule;
    }

    my $deletecount = 0;
    return if @{$self->{chunkedtaskfactories}} == 0;
    my $slice = $self->{ctfquantum} / @{$self->{chunkedtaskfactories}};
    for my $ctf (@{$self->{chunkedtaskfactories}}) {
        $ctf->slice($slice) if $ctf->{done} < $ctf->{count};
        $deletecount++ if $ctf->{done} == $ctf->{count};
    }

    for (0 .. $deletecount) {
        my $index = 0;
        for my $ctf (@{$self->{chunkedtaskfactories}}) {
            if ($ctf->{done} == $ctf->{count}) {
                splice @{$self->{chunkedtaskfactories}}, $index, 1;
                $self->logger->info('Completed a CTF');
                last;
            }
            $index++;
        }
    }

    Synacor::Disbatch::Backend::process_redolog;
    return;
}

sub report_task_done {
    my ($self, $queueid, $task, $status, $stdout, $stderr) = @_;

    $self->logger->trace("Worker PID $$ reporting done: queue #$queueid/$task");

    if ($self->{task_observers}{$task}) {
        $self->logger->warn('Found registered observer.  Enqueuing status.');
        $self->{task_observers}{$task}->enqueue($status);
        delete $self->{task_observers}{$task};
    }

    for my $queue (@{$self->{queues}}) {
        if ($queue->{id} eq $queueid) {
            $queue->report_task_done($task, $status, $stdout, $stderr);
            return;
        }
    }

    $self->logger->warn("Task #$queueid doesn't exist!");
    return;
}

sub scheduler_report {
    my ($self) = @_;

    my @rpt;

    for my $queue (@{$self->{queues}}) {
        #warn Dumper $queue;
        my $tasks_todo = $queue->count_todo;
        my $t = {
            id			=> $queue->{id}->to_string,
            tasks_todo		=> $tasks_todo,
            tasks_done		=> ($queue->count_total - @{$queue->{tasks_doing}} - $tasks_todo),
            tasks_doing		=> scalar @{$queue->{tasks_doing}},
            maxthreads		=> $queue->{maxthreads},
            preemptive		=> $queue->{preemptive},
            name		=> $queue->{name},
            constructor		=> $queue->{constructor},
            tasks_backfill	=> 0,
        };

        for my $ctf (@{$self->{chunkedtaskfactories}}) {
            if ($ctf->{queue} == $queue) {
                $t{tasks_backfill} += $ctf->{count} - $ctf->{done};
            }
        }

        push @rpt, $t;
    }

    return \@rpt;
}

sub set_queue_attr {
    my ($self, $queueid, $attr, $value) = @_;

    my %queues = map { $_->{id} => $_ } @{$self->{queues}};
    return [ 0, 'Invalid queue ID' ] unless exists $queues{$queueid};

    $queues{$queueid}{$attr} = $value;
    Synacor::Disbatch::Backend::update_queue($queueid, $attr, $value);

    return [ 1, undef ];
}

sub filter_collection {
    my ($collection, $filter, $type, $key) = @_;
    $type ||= 'hash';

    my $hr = {};

    if (ref $filter eq 'HASH') {
        # de-share it
        $hr = $filter;
    } else {
        # NOTE: WUT
        eval {
            $hr = eval $filter;
            if ($@) {
                $Engine->logger->warn("Filter eval failure: $@");
                return {};
            }
        };
        if ($@) {
            $Engine->logger->warn("Error processing filter: $@");
            return {};
        }
    }

    if (ref $hr ne 'HASH') {
        $Engine->logger->error("Couldn't process filter hash because it's not a hashref");
        return {};
    }

    for my $k (keys %$hr) {
        if ($hr->{$k} =~ /^qr\/(.*)\/$/) {
            my $re = $1;
            $hr->{$k} = qr/$re/;
        }
    }

    my $query = Synacor::Disbatch::Backend::query_collection($collection, $hr, {retry => 'synchronous'});
    return $query if $type eq 'query';

    my @all = $query->all;
    return \@all if $type eq 'array';

    my %results = map { $_->{$key} => $_ } @all;
    \%results;
}

sub register_queue_constructor {
    my ($self, $name, $constructor) = @_;

    $self->{queue_constructors}{$name} = $constructor;
    return;
}

sub construct_queue {
    my ($self, $type, $name) = @_;

    my $constructor = $self->{queue_constructors}{$type};
    return [ 0, 'Task constructor not found' ] unless $constructor;
    my $queue = &$constructor($type, $self);
    $queue->{name}        = $name;
    $queue->{constructor} = $type;

    $self->add_queue($queue);

    my $oid = Synacor::Disbatch::Backend::insert_collection($self->{config}{queues_collection}, {constructor => $type, name => $name}, {retry => 'synchronous'});
    $queue->{id} = $queue->{_id} = $oid;
    return [ 1, $queue->{id} ];
}

sub delete_queue {
    my ($self, $id) = @_;

    Synacor::Disbatch::Backend::delete_collection($self->{config}{queues_collection}, {_id => $id}, {retry => 'redolog'});

    my $index = 0;
    for my $q (@{$self->{queues}}) {
        if ($q->{id} eq $id) {
            splice @{$self->{queues}}, $index, 1;
            return 1;
        }
        $index++;
    }

    return 0;
}

sub get_queue_by_id {
    my ($self, $queue_id_or_name) = @_;

    for my $queue (@{$self->{queues}}) {
        if ($queue->{id} eq $queue_id_or_name or $queue->{name} eq $queue_id_or_name) {
            return $queue;
        }
    }

    return undef;
}

sub queue_create_tasks {
    my ($self, $queueid, $tasks_arrayref, $returntids) = @_;
    untie $tasks_arrayref;

    my $queue = $self->get_queue_by_id($queueid);
    return [ 0, 'Task not found' ] unless $queue;

    my @tids;

    my $count = 0;
    for my $task (@{$tasks_arrayref}) {
        my $iobject = $queue->create_task($task);
        next unless defined $iobject;
        $count++;
        push @tids, $iobject->{_id} if defined $returntids;
    }

    return [ 1, $count, @tids ] if defined $returntids;
    return [ 1, $count ];
}

sub queue_create_tasks_from_query {
    my ($self, $queueid, $collection, $filter, $columns_arrayref) = @_;

    try {
        my $ctf = Synacor::Disbatch::ChunkedTaskFactory->new($self, $queueid, $collection, $filter, $columns_arrayref);
        push @{$self->{chunkedtaskfactories}}, $ctf;
        [ 1, $ctf->{count} ];
    } catch {
        [ -1, 0, "Error creating chunked task factory from query: $_" ];
    };
}

sub is_active_queue {
    my ($self, $q) = @_;

    return 1 unless $self->{activequeues} or $self->{ignorequeues};

    if ($self->{activequeues}) {
        for my $f (@{$self->{activequeues}}) {
            return 1 if $f eq $q;
        }
        return 0;
    }

    if ($self->{ignorequeues}) {
        for my $f (@{$self->{ignorequeues}}) {
            return 0 if $f eq $q;
        }
        return 1;
    }
}

sub load_queues {
    my ($self) = @_;

    # NOTE: fuck you, matt
    my @queues = Synacor::Disbatch::Backend::query_collection($self->{config}{queues_collection}, {}, {retry => 'synchronous'})->all;
    my %queues = map { $_->{id} => $_ } @{$self->{queues}};

    for my $row (@queues) {
        next if $queues{$row->{_id}};
        next if $self->is_active_queue($row->{_id}) == 0;

        my $constructor = $self->{queue_constructors}{$row->{constructor}};
        unless ($constructor) {
            $self->logger->warn("Couldn't load constructor for $row->{constructor}");
            next;
        }

        my $queue = try {
            &$constructor($row->{constructor}, $self);
        } catch {
            $self->logger->error("Unable to construct queue $row->{name}: $_");
        };
        next unless defined $queue;

        $queue->{id} = $row->{_id};

        for my $attr (keys %$row) {
            $queue->{$attr} = $row->{$attr};
        }

        push @{$self->{queues}}, $queue;
    }
}

sub update_node_status() {
    my ($self) = @_;

    my $status = Synacor::Disbatch::Backend::query_one('nodes', {node => $self->{config}{node}});
    $status->{node}      = $self->{config}{node};
    $status->{queues}    = $self->scheduler_report;
    $status->{timestamp} = DateTime->now;

    Synacor::Disbatch::Backend::update_collection('nodes', {node => $self->{config}{node}}, $status, {upsert => 1});
    $self->reflect_queue_changes;
}

sub reflect_queue_changes {
    my ($self) = @_;

    my $query = Synacor::Disbatch::Backend::query_collection($self->{config}{queues_collection}, {}, {}, {retry => 'no'});
    return unless $query;

    # NOTE: fuck you again, matt
    my @queues = $query->all;
    my %queues = map { $_->{_id} => $_ } @{$self->{queues}};

    foreach my $queue (@queues) {
        my $queue2 = $queues{$queue->{_id}};
        unless ($queue2) {
            $self->load_queues if $self->is_active_queue($queue->{_id}) == 1;
            next;
        }

        for my $key (keys %$queue) {
            next if $key eq '_id';
            if ($queue->{$key} ne $queue2->{$key}) {
                $self->logger->info("Setting $queue->{_id} $key from $queue2->{$key} to $queue->{$key}");
                $queue2->{$key} = $queue->{$key};
            }
        }
    }
}

sub queue_prototypes {
    my ($self) = @_;

    my $r = {};
    for my $type (keys %{$self->{queue_constructors}}) {
        my $constructor = $self->{queue_constructors}{$type};
        unless ($constructor) {
            $self->logger->error("No such constructor '$type'!");
            next;
        }

        my $queue = &$constructor($type, $self);
        unless ($queue) {
            $self->logger->error("Couldn't create queue '$type' from constructor!");
            next;
        }

        $r->{$type}    = $queue->parameters_definitions;
        $r->{settings} = $queue->queue_definitions;	# NOTE: this gets reset every time of the loop
    }

    $r;
}

sub reload_queues {
    $_[0]->{reloadqueues} = 1;
}

sub search_tasks {
    my ($self, $queue, $filter, $isjson, $limit, $skip, $count, $terse) = @_;

    my $attrs = {};
    $attrs->{limit} = $limit if $limit;
    $attrs->{skip}  = $skip  if $skip;

    my $hr;

    if ($isjson) {
        $hr = JSON->new->decode($filter);

        for my $k (keys %$hr) {
            if ($hr->{$k} =~ /^qr\/(.*)\/$/) {
                my $re = $1;
                $hr->{$k} = qr/$re/;
            }
        }
    } else {
        $hr = eval $filter;
        if ($@) {
            $self->logger->error("Error evaluating filter: $@");
            return [];
        }
    }

    if (ref $hr ne 'HASH') {
        $self->logger->error('Filter not a hashref');
        $hr = {};
        #return [];
    }

    $hr->{queue} = MongoDB::OID->new(value => $queue);
    $hr->{_id} = MongoDB::OID->new(value => $hr->{id}) if $hr->{id};
    delete $hr->{id};

    $hr->{status} = int $hr->{status} if defined $hr->{status};

    my $cursor = Synacor::Disbatch::Backend::query_collection($self->{config}{tasks_collection}, $hr, $attrs, {retry => 'synchronous'});
    return [ 1, $cursor->count() ] if $count;
    my @tasks = $cursor->all;

    for my $task (@tasks) {
        my $parameters = $task->{parameters};
        $task->{parameters} = $self->{parameterformat_read}($parameters) if $parameters;
        if ($terse) {
            $task->{stdout} = '';
            $task->{stderr} = '';
        }

        if ($task->{mtime}) {
            my $dt = DateTime->from_epoch(epoch => $task->{mtime});
            $task->{mtime_str} = $dt->ymd . ' ' . $dt->hms;
        }

        if ($task->{ctime}) {
            my $dt = DateTime->from_epoch(epoch => $task->{ctime});
            $task->{ctime_str} = $dt->ymd . ' ' . $dt->hms;
        }
    }

    \@tasks;
}

sub register_task_status_observer {
    my ($self, $tid, $queue) = @_;

    my $task = $Synacor::Disbatch::Engine::mongo->get_collection($self->{config}{tasks_collection})->find_one({_id => MongoDB::OID->new(value => $tid)});
    unless ($task) {
        die "Couldn't find task by $tid\n";
    }

    if ($task->{status} == 1) {
        $queue->enqueue(1);
    } else {
        $self->{task_observers}{$tid} = $queue;
    }
}

sub storable_write {
    nfreeze($_[0]);
}

sub storable_read {
    thaw($_[0]);
}

sub json_write {
    $_[0];
    #JSON->new->encode($_[0]);
}

sub json_read {
    $_[0];
    #JSON->new->decode($_[0]);
}

1;

__END__

=head1 NAME

Synacor::Engine - the core execution engine.

=head1 DESCRIPTION

This module runs the main event loop, brokers threads, and generally decides
when to do something.

The execution engine is also responsible for maintaining the physical state
of all of its queues (and their tasks).

=head1 SYNOPSIS

  use Synacor::Engine;
  my $engine = Synacor::Engine->new;
  $engine->start;

=head1 METHODS

=over 4

=item new()

Creates a new instance of the Synacor::Engine.  You really should only use one of these at one time.

Parameters:

    $users		hashref to users

=item orphan_tasks()

Find any tasks that were not completed in the past iteration, and set their status to orphaned

=item logger()

 Returns a log4perl instance

=item add_queue()

Adds a queue to the Engine for execution.  This will essentially just
periodically and strategically call $queue->schedule().

=item start()

Blocking function call which begins the event bus loop.  This will cause the
Synacor::Engine object to listen and react to events.

=item awaken()

Pause from blocking event loop to fire off all queue schedulers.

=item report_item_done()

Report that an item is complete.  Generally called from an Item's run()
function via the eventbus, this records that an item is complete so the
scheduler can start a new queued item.

=item scheduler_report()

Enumerate through queues, collecting statistics on tasks to-do, complete and
in-progress.  Also includes maxthreads & preemptive.  Callable via eventbus.

=item set_queue_attr()

Set queue attribute.  Callable via eventbus.

=item filter_collection()

Parameters:

  $collection	Collection
  $filter		Perl expression filter
  $type			Hash or array (default: hash)
  $key          Key attribute (Optional, requires $type to eq 'hash')

NOT an object-oriented method for Engine.

=item register_queue_constructor()

Registers a queue constructor with the engine.  Required for on-demand creation.

=item construct_queue()

Using a previously register constructor, instantiate a new queue object.

Parameters:

    $type	String name of class
    $name	Name of new queue (currently ignored)

Callable via eventbus.

=item delete_queue()

Delete a queue from engine & database.

Parameters:

    $id		Queue ID

=item get_queue_by_id()

Returns a queue structure by ID.

Parameters:

    $queueid		Task ID

Callable via eventbus.

=item queue_create_tasks()

Create new tasks and add them to a queue queue.

Parameters:

    $queueid		Task ID
    $tasks_arrayref	Array-ref to arrays of parameters

Callable via eventbus.

=item queue_create_tasks_from_query()

Create new tasks and add them to a queue queue using the result of a user
filter to populate & substitute parameter data.

Parameters:

    $queueid            Task ID
    collection          Collection
    $filter             Perl expression filter
    $columns_arrayref	Array-ref of parameters

Callable via eventbus.

=item is_filtered_queue()

Determine whether queue is filtered in by the INI file

=item load_queues()

Load & initialise queues from database.  This will also load all of the tasks
associated with those queues.

=item update_node_status()

Updates node status to MongoDB.

=item reflect_queue_changes()

Reflect changes made to queue attributes, ostensibly made initially on another node.

=item queue_prototypes()

Returns a hashref of queues, and the arguments they take to create new tasks;

=item reload_queues()

Tells engine to reload queues on next iteration of the engine main loop

=item search_tasks()

Search through tasks.

