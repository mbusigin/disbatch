package Disbatch;

use 5.12.0;
use warnings;

use boolean 0.25;
use Cpanel::JSON::XS;
use Data::Compare;
use Data::Dumper;
use Encode;
use File::Slurp;
use Log::Log4perl;
use MongoDB 1.0.0;
use POSIX 'setsid';
use Safe::Isa;
use Sys::Hostname;
use Time::Moment;
use Try::Tiny::Retry;

my $json = Cpanel::JSON::XS->new->utf8;

my $default_configs = {
    development => {
        label => 'development',
        log4perl => {
            level => 'TRACE',
            appenders => {
                filelog => {
                    type => 'Log::Log4perl::Appender::File',
                    layout => '[%p] %d %F{1} %L %C %c> %m %n',
                    args => { filename => 'disbatchd.log' }
                },
                screenlog => {
                    type => 'Log::Log4perl::Appender::ScreenColoredLevels',
                    layout => '[%p] %d %F{1} %L %C %c> %m %n',
                    args => { },
                }
            }
        },
        task_runner => './bin/task_runner',
    },
    production => {
        label => 'production',
        log4perl => {
            level => 'DEBUG',
            appenders => {
                filelog => {
                    type => 'Log::Log4perl::Appender::File',
                    layout => '[%p] %d %F{1} %L %C %c> %m %n',
                    args => { filename => '/var/log/disbatchd.log' },
                },
                screenlog => {
                    type => 'Log::Log4perl::Appender::ScreenColoredLevels',
                    layout => '[%p] %d %F{1} %L %C %c> %m %n',
                    args => { },
                }
            }
        },
        task_runner => '/usr/bin/task_runner',
    },
};

sub new {
    my $class = shift;
    my $self = { @_ };
    $self->{node} = hostname;
    $self->{class} //= 'Disbatch';
    $self->{class} = lc $self->{class};
    bless $self, $class;
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

sub mongo {
    my ($self) = @_;
    return $self->{mongo} if defined $self->{mongo};
    $self->{config}{attributes} //= {};
    my %attributes = %{ $self->{config}{attributes} // {} };
    if (defined $self->{config}{auth}) {
        my $username = 'task_runner';
        $username = 'disbatchd' if $self->{class} eq 'disbatch';
        $username = 'disbatch_web' if $self->{class} eq 'disbatch::web';
        $attributes{username} = $username;
        $attributes{password} = $self->{config}{auth}{$username};
        $attributes{db_name} = $self->{config}{database};
    }
    warn "Connecting ", scalar localtime;
    $self->{mongo} = MongoDB->connect($self->{config}{mongohost}, \%attributes)->get_database($self->{config}{database}) ;
}
sub nodes  { $_[0]->mongo->coll('nodes') }
sub queues { $_[0]->mongo->coll('queues') }
sub tasks  { $_[0]->mongo->coll('tasks') }
sub config { $_[0]->mongo->coll('config') }

# ensures that 'production' and 'development' config documents exist, and that $self->{config}{default_config} // 'production' is active
sub ensure_config {
    my ($self) = @_;
    my $config_doc = try { $self->config->find_one({active => true}) } catch { $_ };
    if (!defined $config_doc or ref $config_doc ne 'HASH') {
        my $err = $config_doc // 'no {"active":true} config doc';
        warn "$err\n";
        $self->ensure_indexes;
        for my $label (keys %$default_configs) {
            if (!$self->config->find_one({ label => $label })) {
                try { $self->config->insert($default_configs->{$label}) } catch { warn "Could not insert $label config document: $_\n" };
            }
        }
        my $set_active = $self->{config}{default_config} // 'production';
        my $res = $self->config->update({ label => $set_active }, { '$set' => { active => true } });
        die "Could not set config document $set_active to active\n" unless $res->{n} == 1;
    }
}

sub load_config_file {
    my ($self) = @_;
    if (!defined $self->{config}) {
        $self->{config} = try { $json->relaxed->decode(scalar read_file($self->{config_file})) } catch { die "Could not parse $self->{config_file}: $_" };	# FIXME: log4perl the error
        @{$self->{config_keys_at_startup}} = keys %{$self->{config}};
        $self->ensure_config;
        if (!defined $self->{config}{mongohost} or !defined $self->{config}{database}) {
            my $error = "Both 'mongohost' and 'database' must be defined in file $self->{config_file}";
            my $label = $self->{config}{default_config} // 'production';
            $self->{config}{log4perl} //= $default_configs->{$label}{log4perl};
            $self->logger->logdie($error);
        }
    }
}

# loads the config file at startup and (re)loads the current active config collection document
# anything in the config file at startup is static and cannot be changed without restarting disbatchd
sub load_config {
    my ($self) = @_;
    $self->load_config_file;
    my $config_doc = try { $self->config->find_one({active => true}) } catch { $_ };
    if (!defined $config_doc or ref $config_doc ne 'HASH') {
        my $error = defined $config_doc ? $config_doc : 'no {"active":true} config doc';
        if (!defined $self->{config}{log4perl}) {
            $self->{config}{log4perl} = {
                level => 'TRACE',
                appenders => {
                    screenlog => { type => 'Log::Log4perl::Appender::ScreenColoredLevels' },
                    filelog => { type => 'Log::Log4perl::Appender::File', args => { filename => "/tmp/disbatchd.log" } },
                },
            };
            $self->logger->warn("No log4perl setting found – logging to /tmp/disbatchd.log");
        }
        $self->logger->error("Could not find config doc: $error");
        undef;
    } else {
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
                $self->logger->info("Setting $key to ", $json->allow_nonref->encode($config_doc->{$key})) unless $key eq 'label';
                $self->{config}{$key} = $config_doc->{$key};
            }
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
    try { $self->tasks->indexes->create_many(@task_indexes) } catch { $self->logger->logdie("Could not ensure_indexes: $_") };
    try {
        $self->config->indexes->create_one([ active => 1 ], { unique => true, sparse => true });
        $self->config->indexes->create_one([ label => 1 ], { unique => true });
        $self->mongo->coll('tasks.chunks')->indexes->create_one([ files_id => 1, n => 1 ], { unique => true });
        $self->mongo->coll('tasks.files')->indexes->create_one([ filename => 1, 'metadata.task_id' => 1 ]);
    } catch {
        $self->logger->logdie("Could not ensure_indexes: $_")
    };
}

# validates constructors for defined queues
sub validate_plugins {
    my ($self) = @_;
    my @queues = try { $self->queues->find->all } catch { $self->logger->error("Could not find queues: $_"); () };
    for my $constructor (map { $_->{constructor} } @queues) {
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

sub scheduler_report {
    my ($self) = @_;
    my @result;
    my @queues = try { $self->queues->find->all } catch { $self->logger->error("Could not find queues: $_"); () };
    for my $queue (@queues) {
        my $tasks_doing = try { $self->tasks->count({queue => $queue->{_id}, status => {'$in' => [-1,0]}}) } catch { $self->logger->error("Could not count tasks doing: $_"); -1 };
        # FIXME: the below two lines can cause a race condition with Disbatch::Web::create_tasks()
        $queue->{count_total} //= $self->count_total($queue->{_id});
        $queue->{count_todo} //= $self->count_todo($queue->{_id});
        push @result, {
            id             => $queue->{_id}{value},
            tasks_todo     => $tasks_doing == -1 ? $queue->{count_todo} : ($queue->{count_todo} - $tasks_doing),
            tasks_done     => $tasks_doing == -1 ? -1 : ($queue->{count_total} - $queue->{count_todo}),
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

    my $status = try { $self->nodes->find_one({node => $self->{node}}) // {} } catch { $self->logger->error("Could not find node: $_"); undef };
    return unless defined $status;
    $status->{node}      = $self->{node};
    $status->{queues}    = $self->scheduler_report;
    $status->{timestamp} = Time::Moment->now_utc;
    try { $self->nodes->update_one({node => $self->{node}}, {'$set' => $status}, {upsert => 1}) } catch { $self->logger->error("Could not update node: $_") };
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
    $self->{claimed_task} = try { $self->tasks->find_one_and_update($query, $update, $options) } catch { $self->logger->error("Could not claim task: $_"); undef };
}

# will unclaim and return the task document for the given OID, or return undef
sub unclaim_task {
    my ($self, $task_id) = @_;
    my $query  = { _id => $task_id, node => $self->{node}, status => -1 };
    my $update = { '$set' => {node => -1, status => -2, mtime => 0} };
    $self->logger->warn("Unclaliming task $task_id");
    retry { $self->tasks->find_one_and_update($query, $update) } catch { $self->logger->error("Could not unclaim task $task_id: $_"); undef };
}

sub orphaned_tasks {
    my ($self) = @_;
    try { $self->tasks->update_many({node => $self->{node}, status => -1, mtime => {'$lt' => time - 300} }, {'$set' => {status => -6}}) }
    catch { $self->logger->error("Could not find orphaned_tasks: $_") };
}

# will fork & exec to start a given task
# NOTE: $self->{config_file} is required
sub start_task {
    my ($self, $queue, $task) = @_;
    my $command = $self->{config}{task_runner};
    my @args = (
        '--config' => $self->{config_file},
        '--plugin' => $self->{plugins}{$queue->{constructor}},
        '--task'   => $task->{_id},
    );
    push @args, '--nogfs' unless ($self->{config}{gfs} // true);
    $self->logger->info(join ' ', $command, @args);
    unless (fork) {
        setsid != -1 or die "Can't start a new session: $!";
        unless (exec $command, @args) {
            $self->mongo->reconnect;
            $self->logger->error("Could not exec '$command', unclaiming task $task->{_id} and setting threads to 0 for $queue->{name}");
            retry { $self->queues->update_one({_id => $queue->{_id}}, {'$set' => {maxthreads => 0}}) } catch { "Could not set queues to 0 for $queue->{name}: $_" };
            $self->unclaim_task($task->{_id});
            exit;
        }
    }
    $self->{claimed_task} = undef;
}

# returns count of status -1 and 0 for given queue _id
sub count_running {
    my ($self, $queue_id) = @_;
    try { $self->tasks->count({node => $self->{node}, status => {'$in' => [-1,0]}, queue => $queue_id}) } catch { $self->logger->error("Could not count running tasks"); undef };
}

# returns count_todo for given queue _id, setting it if undefined or negative
sub count_todo {
    my ($self, $queue_id) = @_;

    if (!$queue_id->$_isa('MongoDB::OID')) {
        $self->logger->error("count_todo() was not passed an MongoDB::OID object");
        return undef;
    }

    my $queue = try { $self->queues->find_one({_id => $queue_id}) } catch { $self->logger->error("Could not find queue"); undef };
    if (defined $queue and defined $queue->{count_todo} and $queue->{count_todo} >= 0) {
        $queue->{count_todo};
    } else {
        try {
            my $count = $self->tasks->count({queue => $queue_id, status => {'$lte' => 0}});
            $self->queues->update_one({_id => $queue_id, count_todo => undef}, {'$set' => {count_todo => $count}});
            $count;
        } catch {
            $self->logger->error("Could not update count_todo: $_");
            undef;
        };
    }
}

# returns count_total for given queue _id, setting it if undefined or negative
sub count_total {
    my ($self, $queue_id) = @_;

    if (!$queue_id->$_isa('MongoDB::OID')) {
        $self->logger->error("count_total() was not passed an MongoDB::OID object");
        return undef;
    }

    my $queue = try { $self->queues->find_one({_id => $queue_id}) } catch { $self->logger->error("Could not find queue"); undef };
    if (defined $queue and defined $queue->{count_total} and $queue->{count_total} >= 0) {
        $queue->{count_total};
    } else {
        try {
            my $count = $self->tasks->count({queue => $queue_id});
            $self->queues->update_one({_id => $queue_id, count_total => undef}, {'$set' => {count_total => $count}});
            $count;
        } catch {
            $self->logger->error("Could not update count_total: $_");
            undef;
        };
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
    my $node = try { $self->nodes->find_one({node => $self->{node}}, {maxthreads => 1}) } catch { $self->logger->error("Could not find node: $_"); { maxthreads => 0 } };
    my $node_running = $self->count_running({'$exists' => 1}) // 0;
    return if defined $node and defined $node->{maxthreads} and $node_running >= $node->{maxthreads};
    my @queues = try { $self->queues->find->all } catch { $self->logger->error("Could not find queues: $_"); () };
    for my $queue (@queues) {
        if ($self->{plugins}{$queue->{constructor}} and $self->is_active_queue($queue->{_id})) {
            my $running = $self->count_running($queue->{_id});
            while (defined $running and ($queue->{maxthreads} // 0) > $running and (!defined $node->{maxthreads} or defined $node->{maxthreads} > $node_running)) {
                my $task = $self->claim_task($queue);
                last unless defined $task;
                $self->start_task($queue, $task);
                $running = $self->count_running($queue->{_id});
                $node_running = $self->count_running({'$exists' => 1}) // 0;
            }
        } else {
            $revalidate_plugins = 1;
        }
    }
    $self->revalidate_plugins if $revalidate_plugins;
}

### END Synacor::Disbatch::Queue like stuff ###

# returns the file document
# throws any error
sub put_gfs {
    my ($self, $content, $filename, $metadata) = @_;
    $filename ||= 'unknown';
    my $chunk_size = 255 * 1024;
    my $file_doc = {
        uploadDate => DateTime->now,
        filename   => $filename,
        chunkSize  => $chunk_size,
        length     => length encode_utf8($content),
        md5        => Digest::MD5->new->add(encode_utf8($content))->hexdigest,
    };
    if (defined $metadata) {
        die 'metadata must be a HASH' unless ref $metadata eq 'HASH';
        $file_doc->{metadata} = $metadata;
    }
    my $files_id = $self->mongo->coll('tasks.files')->insert($file_doc);
    my $n = 0;
    for (my $n = 0; length $content; $n++) {
        my $data = substr $content, 0, $chunk_size, '';
        $self->mongo->coll('tasks.chunks')->insert({ n => $n, data => bless(\$data, 'MongoDB::BSON::String'), files_id => $files_id });
    }
    $files_id;
}

# returns the content as a string
# throws an error if the file document does not exist, and any other error
sub get_gfs {
    my ($self, $filename_or_id, $metadata) = @_;
    my $file_id;
    if ($filename_or_id->$_isa('MongoDB::OID')) {
        $file_id = $filename_or_id;
    } else {
        my $query = {};
        $query->{filename} = $filename_or_id if defined $filename_or_id;
        $query->{metadata} = $metadata if defined $metadata;
        $file_id = $self->mongo->coll('tasks.files')->find($query)->next->{_id};
    }
    # this does no error-checking:
    my $result = $self->mongo->coll('tasks.chunks')->find({files_id => $file_id})->sort({n => 1})->result;
    my $data;
    while (my $chunk = $result->next) {
        $data .= $chunk->{data};
    }
    $data;
}

DESTROY {
    my ($self) = @_;
    # this happens after the END block in the calling script, or if the object ever goes out of scope
}

1;

__END__

=encoding utf8

=head1 NAME

Disbatch - a scalable distributed batch processing framework using MongoDB.

=head1 SUBROUTINES

=over 2

=item new(class => $class, ...)

"class" defaults to "Disbatch", and the value is then lowercased.

"node" is the hostname.

Anything else is put into $self.

=item logger($type)

Parameters: type (string, optional)

Returns a L<Log::Log4perl> object.

=item mongo

Parameters: none

Returns a L<MongoDB::Database> object.

=item nodes

Parameters: none

Returns a L<MongoDB::Collection> object for collection "nodes".

=item queues

Parameters: none

Returns a L<MongoDB::Collection> object for collection "queues".

=item tasks

Parameters: none

Returns a L<MongoDB::Collection> object for collection "tasks".

=item config

Parameters: none

Returns a L<MongoDB::Collection> object for collection "config".

=item ensure_config

Parameters: none

Ensures that C<production> and C<development> config documents exist, and that C<< $self->{config}{default_config} // 'production' >> is active.

Returns nothing.

=item load_config_file

Parameters: none

Loads C<< $self->{config_file} >> only if C<< $self->{config} >> is undefined.

Anything in the config file at startup is static and cannot be changed without restarting disbatchd.

Returns nothing.

=item load_config

Parameters: none

Loads the config file at startup and (re)loads the current active config collection document.

Returns nothing.

=item ensure_indexes

Parameters: none

Ensures the proper MongoDB indexes are created for C<tasks>, C<config>, C<tasks.files>, and C<tasks.chunks> collections.

Returns nothing.

=item validate_plugins

Parameters: none

Validates constructors for defined queues.

Returns nothing.

=item revalidate_plugins

Parameters: none

Clears constructor validation and re-runs C<validate_plugins()>.

Returns nothing.

=item scheduler_report

Parameters: none

Used by the CLI tool and the web interface to get queue information.

Returns an C<ARRAY> containing C<HASH>es of queue information.

=item update_node_status

Parameters: none

Updates the node document with the current timestamp and queues as returned by C<scheduler_report()>.

Returns nothing.

=item claim_task($queue)

Parameters: queue document

Claims a task (sets status to -1 and sets node to hostname) for the given queue.

Returns a task document, or undef if no queued task found.

=item unclaim_task($task_id)

Parameters: L<MongoDB::OID> object for a task

Sets the task's node to -1, status to -2, and mtime to 0 if it has status -1 and this node's hostname.

Returns a task document, or undef if a matching task is not found.

=item orphaned_tasks

Parameters: none

Sets status to -6 for all tasks for this node with status -1 and an mtime of more than 300 seconds ago.

Returns nothing.

=item start_task($queue, $task)

Parameters: queue document, task document

Will fork and exec C<< $self->{config}{task_runner} >> to start the given task.
If the exec fails, it will set threads to 0 for the given queue and call C<unclaim_task()>.

Returns nothing.

=item count_running($queue_id)

Parameters: L<MongoDB::OID> object for a queue (or any other valid query value such as C<< {'$exists' => 1} >>).

Counts all tasks on the current node for the given queue with a status of 0 or -1.

Returns: a non-negative integer, or undef if an error.

=item count_todo($queue_id)

Parameters: L<MongoDB::OID> object for a queue

Returns the C<count_todo> value for the given queue if defined and non-negative,
otherwise counts all tasks for the given queue with a status less than or equal to 0 and sets C<count_todo>.

Returns: a non-negative integer, or undef if an error.

=item count_total($queue_id)

Parameters: L<MongoDB::OID> object for a queue

Returns the C<count_total> value for the given queue if defined and non-negative, otherwise counts all tasks for the given queue and sets C<count_total>.

Returns: a non-negative integer, or undef if an error.

=item is_active_queue($queue_id)

Parameters: L<MongoDB::OID> object for a queue

Checks C<config.activequeues> if it has entries, and returns 1 if given queue is defined in it or 0 if not.
If it does not have entries, checks C<config.ignorequeues> if it has entries, and returns 0 if given queue is defined in it or 1 if not.

Returns 1 or 0.

=item process_queues

Parameters: none

Will claim and start as many tasks for each queue as allowed by the current node's C<maxthreads> and each queue's C<maxthreads>.

Returns nothing.

=item put_gfs($content, $filename, $metadata)

Parameters: UTF-8 content to store, optional filename to store it as, optional metadata C<HASH>

Stores UTF-8 content in a custom GridFS format that does not store it as BinData.

Returns a C<MongoDB::OID> object for the ID inserted in the C<tasks.files> collection.

=item get_gfs($filename_or_id, $metadata)

Parameters: filename or C<MongoDB::OID> object, optional metadata C<HASH>

Gets UTF-8 content from the custom GridFS format. Metadata is only used if given a filename instead of a C<MongoDB::OID> object.

Returns: content string.

=back

=head1 SEE ALSO

L<Disbatch::Web>

L<Disbatch::Roles>

L<Disbatch::Plugin::Demo>

L<disbatchd>

L<disbatch.pl>

L<task_runner>

L<disbatch-create-users>

=head1 AUTHORS

Ashley Willis <awillis@synacor.com>

Matt Busigin

=head1 COPYRIGHT AND LICENSE

This software is Copyright (c) 2016 by Ashley Willis.

This is free software, licensed under:

  The Apache License, Version 2.0, January 2004
