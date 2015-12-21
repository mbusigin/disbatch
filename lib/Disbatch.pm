package Disbatch;

use 5.12.0;
use warnings;

use boolean;
use Cpanel::JSON::XS;
use Data::Compare;
use Data::Dumper;
use File::Slurp;
use Log::Log4perl;
use MongoDB 1.0.0;
use POSIX 'setsid';
use Sys::Hostname;
use Time::Moment;
use Try::Tiny::Retry;

sub new {
    my $class = shift;
    my $self = { @_ };
    $self->{node} = hostname;
    $self->{class} //= 'Disbatch';
    $self->{class} = lc $self->{class};
    bless $self, $class;

    $self->load_config;

    $self;
}

sub logger {
    my ($self, $type) = @_;
    my $logger = defined $type ? "$self->{class}.$type" : $self->{class};
    $self->{loggers}{$logger} //= Log::Log4perl->get_logger($logger);
    if (!keys %{Log::Log4perl->appenders}){
        $self->{loggers}{$logger}->level($self->{config}{log4perl}{level});
        my $default_layout = "[%p] %d %F{1} %L %C %c> %m %n";
        for my $name (keys %{$self->{config}{log4perl}{appenders}}) {
            my $ap = Log::Log4perl::Appender->new($self->{config}{log4perl}{appenders}{$name}{type}, name => $name, %{$self->{config}{log4perl}{appenders}{$name}{args}});
            $ap->layout(Log::Log4perl::Layout::PatternLayout->new($self->{config}{log4perl}{appenders}{$name}{layout} // $default_layout));
            $self->{loggers}{$logger}->add_appender($ap);
        }
    }
    $self->{loggers}{$logger};
}

sub mongo { MongoDB->connect($_[0]->{config}{mongohost})->get_database($_[0]->{config}{mongodb}) }
sub nodes  { $_[0]->mongo->get_collection('nodes') }
sub queues { $_[0]->mongo->get_collection('queues') }
sub tasks  { $_[0]->mongo->get_collection('tasks') }

# loads the config file at startup and (re)loads the current active config collection document
# anything in the config file at startup is static and cannot be changed without restarting disbatchd
sub load_config {
    my ($self) = @_;
    my $json = Cpanel::JSON::XS->new->utf8;
    if (!defined $self->{config}) {
        $self->{config} = $json->relaxed->decode(scalar read_file($self->{config_file}));
        @{$self->{config_keys_at_startup}} = keys %{$self->{config}};
        if (!defined $self->{config}{mongohost} or !defined $self->{config}{mongodb}) {
            my $error = "Both 'mongohost' and 'mongodb' must be defined in file $self->{config_file}";
            if (defined $self->{config}{log4perl}) {
                $self->logger->logdie($error);
            } else {
                die "$error\n";
            }
        }
    }

    my $config_doc = $self->mongo->get_collection('config')->find_one({active => true});

    # need to initialize Log::Log4perl, but want to log its settings below, so we do this:
    if (!defined $self->{config}{log4perl}) {
        $self->{config}{log4perl} = $config_doc->{log4perl};
        $self->logger;
        $self->{config}{log4perl} = undef;
    }

    for my $key (keys %$config_doc) {
        next if $key eq 'active' or $key eq '_id';
        if (grep { $key eq $_ } @{$self->{config_keys_at_startup}}) {
            if (!exists $self->{config_quiet}{$key} or !Compare($self->{config_quiet}{$key},$config_doc->{$key})) {
                $self->logger->warn("Not overwriting hardcoded value for '$key' in $self->{config_file}: ", $json->allow_nonref->encode($self->{config}{$key}));
            }
            $self->{config_quiet}{$key} = $config_doc->{$key};
        } elsif (!Compare($self->{config}{$key},$config_doc->{$key})) {
            my $value = $config_doc->{$key};
            $self->logger->info("Setting $key to ", $json->allow_nonref->encode($value)) unless $key eq 'label';
            $self->{config}{$key} = $config_doc->{$key};
        }
    }

    # FIXME: test that certain config values are defined and are valid
    if (!defined $self->{config}{task_runner}) {
        $self->logger->logdie("No 'task_runner' defined in config");
    }
}

# from Synacor::Disbatch::Backend
sub ensure_indexes {
    my ($self) = @_;
    my @task_indexes = (
        { keys => [node => 1, status => 1, queue => 1] },
        { keys => [node => 1, status => 1, queue => 1, _id => 1] },
        { keys => [node => 1, status => 1, queue => 1, _id => -1] },
        { keys => [queue => 1, status => 1] },
    );
    $self->tasks->indexes->create_many(@task_indexes);
}

# validates constructors for defined queues
sub validate_plugins {
    my ($self) = @_;
    for my $constructor (map { $_->{constructor} } $self->queues->find->all) {
        next if exists $self->{plugins}{$constructor};
        if ($constructor !~ /^[\w:]+$/) {
            $self->logger->error("Illegal constructor value: $constructor");
        } elsif (eval "require $constructor; $constructor->new->can('run');") {
            $self->{plugins}{$constructor} = $constructor;
            next if exists $self->{old_plugins}{$constructor};
            $self->logger->info("$constructor is valid for queues");
        } elsif (eval "require ${constructor}::Task; ${constructor}::Task->new->can('run');") {
            $self->{plugins}{$constructor} = $constructor . '::Task';
            next if exists $self->{old_plugins}{$constructor};
            $self->logger->info("${constructor}::Task is valid for queues");
            $self->logger->warn("Having a plugin format with a subpackage *::Task is deprecated");
        } else {
            $self->{plugins}{$constructor} = undef;
            $self->logger->warn("Could not load $constructor, ignoring queues using it");
        }
    }
}

# clears constructor validation and re-runs
sub revalidate_plugins {
    my ($self) = @_;
    $self->{old_plugins} = $self->{plugins};
    $self->{plugins} = {};
    $self->validate_plugins;
}

# TODO: merge this and Disbatch::Web /scheduler-json into one thing, so not repeating the (mostly) same code
sub scheduler_report {
    my ($self) = @_;
    my @result;
    for my $queue ($self->queues->find->all) {
        my $tasks_doing = $self->tasks->count({queue => $queue->{_id}, status => {'$in' => [-1,0]}});
        $queue->{count_total} //= 0;
        $queue->{count_todo} //= 0;
        push @result, {
            id             => $queue->{_id}{value},
            tasks_todo     => $queue->{count_todo},
            tasks_done     => ($queue->{count_total} - $tasks_doing - $queue->{count_todo}),
            tasks_doing    => $tasks_doing,
            maxthreads     => $queue->{maxthreads},
            name           => $queue->{name},
            constructor    => $queue->{constructor},
            preemptive     => 1,
            tasks_backfill => 0,
        };
    }
    \@result;
}

# updates the nodes collection
sub update_node_status {
    my ($self) = @_;

    my $status = $self->nodes->find_one({node => $self->{node}}) // {};
    $status->{node}      = $self->{node};
    $status->{queues}    = $self->scheduler_report;
    $status->{timestamp} = Time::Moment->now_utc;

    $self->nodes->update_one({node => $self->{node}}, {'$set' => $status}, {upsert => 1});
}

### Synacor::Disbatch::Queue like stuff ###

# will claim and return a task for given queue, or return undef
sub claim_task {
    my ($self, $queue) = @_;

    $self->{sort} //= 'default';

    my $query  = { node => -1, status => -2, queue => $queue->{_id} };
    my $update = { '$set' => {node => $self->{node}, status => -1, mtime => time} };

    my $options;
    if ($self->{sort} eq 'fifo') {
        $options->{sort} = { _id => 1 };
    } elsif ($self->{sort} eq 'lifo') {
        $options->{sort} = { _id => -1 };
    } elsif ($self->{sort} ne 'default') {
        $self->logger->warn("$queue->{name}: unknown sort order '$self->{sort}' -- using default");
    }
    $self->{claimed_task} = $self->tasks->find_one_and_update($query, $update, $options);
}

# will claim and return a task for given queue, or return undef
sub unclaim_task {
    my ($self, $task_id) = @_;
    my $query  = { _id => $task_id, node => $self->{node}, status => -1 };
    my $update = { '$set' => {node => -1, status => -2, mtime => 0} };
    $self->logger->warn("Unclaliming task $task_id");
    $self->tasks->find_one_and_update($query, $update);
}

sub orphaned_tasks {
    my ($self) = @_;
    $self->tasks->update_many({node => $self->{node}, status => -1, mtime => {'$lt' => time - 60} }, {'$set' => {status => -6}});
}

# will fork & exec to start a given task
sub start_task {
    my ($self, $queue, $task) = @_;
    my $command = $self->{config}{task_runner};
    my @args = (
        '--host' => $self->{config}{mongohost},
        '--db' => $self->{config}{mongodb},
        '--plugin' => $self->{plugins}{$queue->{constructor}},
        '--task' => $task->{_id},
        '--log4perl' => Cpanel::JSON::XS->new->utf8->encode($self->{config}{log4perl}),
    );
    $self->logger->info(join ' ', $command, @args);
    unless (fork) {
        setsid != -1 or die "Can't start a new session: $!";
        unless (exec $command, @args) {
            $self->logger->error("Could not exec '$command', unclaiming task $task->{_id} and setting threads to 0 for $queue->{name}");
            $self->tasks->update_one({_id => $task->{_id}}, {'$set' => {node => -1, status => -2, mtime => 0}});
            $self->queues->update_one({_id => $queue->{_id}}, {'$set' => {maxthreads => 0}});
            exit;
        }
    }
    $self->{claimed_task} = undef;
}

# returns count of status -1 and 0 for given queue _id
sub count_running {
    my ($self, $queue_id) = @_;
    $self->tasks->count({node => $self->{node}, status => {'$in' => [-1,0]}, queue => $queue_id});
}

# returns count_todo for given queue _id, setting it if undefined
sub count_todo {
    my ($self, $queue_id) = @_;

    my $queue = $self->queues->find_one({_id => $queue_id});
    if (defined $queue and defined $queue->{count_todo}) {
        return $queue->{count_todo};
    } else {
        my $count = $self->tasks->count({queue => $queue_id, status => {'$lte' => 0}});
        $self->queues->update_one({_id => $queue_id}, {'$set' => {count_todo => $count}});
        return $count;
    }
}

# returns count_total for given queue _id, setting it if undefined
sub count_total {
    my ($self, $queue_id) = @_;

    my $queue = $self->queues->find_one({_id => $queue_id});
    if (defined $queue and defined $queue->{count_total}) {
        return $queue->{count_total};
    } else {
        my $count = $self->tasks->count({queue => $queue_id});
        $self->queues->update_one({_id => $queue_id}, {'$set' => {count_total => $count}});
        return $count;
    }
}

# checks if this node will process (activequeues) or ignore (ignorequeues) a queue
sub is_active_queue {
    my ($self, $queue_id) = @_;
    if (@{$self->{config}{activequeues} // []}) {
        grep($queue_id->{value} eq $_, @{$self->{config}{activequeues}}) ? 1 : 0;
    } elsif (@{$self->{config}{ignorequeues} // []}) {
        grep($queue_id->{value} eq $_, @{$self->{config}{ignorequeues}}) ? 0 : 1;
    } else {
        1;
    }
}

# will run as many tasks for each queue as allowed
sub process_queues {
    my ($self) = @_;
    my $revalidate_plugins = 0;
    for my $queue ($self->queues->find->all) {
        if ($self->{plugins}{$queue->{constructor}} and $self->is_active_queue($queue->{_id})) {
            $self->count_total($queue->{_id}) unless defined $queue->{count_total};
            $self->count_todo($queue->{_id}) unless defined $queue->{count_todo};
            my $running = $self->count_running($queue->{_id});
            while ($queue->{maxthreads} // 0 > $running) {
                my $task = $self->claim_task($queue);
                last unless defined $task;
                $self->start_task($queue, $task);
                $running = $self->count_running($queue->{_id});
            }
        } else {
            $revalidate_plugins = 1;
        }
    }
    $self->revalidate_plugins if $revalidate_plugins;
}

### END Synacor::Disbatch::Queue like stuff ###

DESTROY {
    my ($self) = @_;
    # this happens after the END block below
}

1;