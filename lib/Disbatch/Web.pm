package Disbatch::Web;

use 5.12.0;
use strict;
use warnings;

use Cpanel::JSON::XS;
use Data::Dumper;
use Disbatch;
use File::Slurp;
use Limper::SendFile;
use Limper::SendJSON;
use Limper;
use Log::Log4perl;
use MongoDB::OID 1.0.0;
use Safe::Isa;
use Try::Tiny::Retry;
use URL::Encode qw/url_params_mixed/;

my $json = Cpanel::JSON::XS->new->utf8;
my $disbatch;

sub init {
    my $args = { @_ };
    $disbatch = Disbatch->new(class => 'Disbatch::Web', config_file => $args->{config_file} // '/etc/disbatch/disbatch.json');
    $disbatch->load_config_file;
    public $disbatch->{config}{web_root} // '/etc/disbatch/htdocs/';
}

sub parse_params {
    if ((request->{headers}{'content-type'} // '') eq 'application/x-www-form-urlencoded') {
        url_params_mixed(request->{body}, 1);
    } elsif ((request->{headers}{'content-type'} // '') eq 'application/json') {
        try { $json->decode(request->{body}) } catch { $_ };
    } elsif (request->{query}) {
        url_params_mixed(request->{query}, 1);
    }
}

######################

get '/scheduler-json' => sub {
    send_json $disbatch->scheduler_report;
};

post '/set-queue-attr-json' => sub {
    my $params = parse_params;
    my @valid_attributes = qw/maxthreads preemptive/;
    unless (grep $params->{attr}, @valid_attributes) {
        status 400;
        return send_json { success => 0, error => 'Invalid attr'};
    }
    unless (defined $params->{value}) {
        status 400;
        return send_json {success => 0, error => 'You must supply a value'};
    }
    unless (defined $params->{queueid}) {
        status 400;
        return send_json {success => 0, error => 'You must supply a queueid'};
    }
    my $res = try {
        $disbatch->queues->update_one({_id => MongoDB::OID->new(value => $params->{queueid})}, {'$set' => { $params->{attr} => $params->{value} }});
    } catch {
        Limper::warning "Could not update queue $params->{queueid}: $_";
        $_;
    };
    my $reponse = {
        success => $res->{matched_count} == 1 ? 1 : 0,
        ref $res => {%$res},
    };
    unless ($reponse->{success}) {
        status 400;
        $reponse->{error} = "$res";
    }
    send_json $reponse;
};

post '/start-queue-json' => sub {
    my $params = parse_params;
    unless (defined $params->{type} and defined $params->{name}) {
        status 400;
        return send_json [ 0, 'type and name required'];
    }

    my $queue = { constructor => $params->{type}, name => $params->{name} };
    my $res = try { $disbatch->queues->insert_one($queue) } catch { Limper::warning "Could not create queue $params->{id}: $_"; $_ };
    my $reponse = {
        success => defined $res->{inserted_id} ? 1 : 0,
        ref $res => {%$res},
    };
    unless ($reponse->{success}) {
        status 400;
        $reponse->{error} = "$res";
    }
    send_json [ $reponse->{success}, $reponse->{ref $res}{inserted_id}, $reponse ], convert_blessed => 1;
};

post '/delete-queue-json' => sub {
    my $params = parse_params;
    unless (defined $params->{id}) {
        status 400;
        return send_json [ 0, 'id required'];
    }

    my $res = try { $disbatch->queues->delete_one({_id => MongoDB::OID->new(value => $params->{id})}) } catch { Limper::warning "Could not delete queue $params->{id}: $_"; $_ };
    my $reponse = {
        success => $res->{deleted_count} ? 1 : 0,
        ref $res => {%$res},
    };
    unless ($reponse->{success}) {
        status 400;
        $reponse->{error} = "$res";
    }
    send_json [ $reponse->{success}, $reponse ];
};

sub get_queue_oid {
    my ($queue) = @_;
    my $queue_id = try {
        MongoDB::OID->new(value => $queue);
    } catch {
        my $q = try { $disbatch->queues->find_one({name => $queue}) } catch { Limper::warning "Could not find queue $queue: $_"; undef };
        defined $q ? $q->{_id} : undef;
    };
}

# creates a task for given queue _id and parameters, returning task _id
sub create_tasks {
    my ($queue_id, $tasks) = @_;

    my @tasks = map {
        queue      => $queue_id,
        status     => -2,
        stdout     => undef,
        stderr     => undef,
        node       => -1,
        parameters => $_,
        ctime      => time,
        mtime      => 0,
    }, @$tasks;

    my $res = try { $disbatch->tasks->insert_many(\@tasks) } catch { Limper::warning "Could not create tasks: $_"; $_ };
    if (!$res->$_isa('MongoDB::InsertManyResult')) {
        try { $disbatch->queues->update_one({_id => $queue_id}, {'$inc' => {count_total => scalar @{$res->{inserted}}, count_todo => scalar @{$res->{inserted}}}}) }
        catch { Limper::warning "Could not update count_total and count_todo for $queue_id: $_" };
    }
    $res;
}

post '/queue-create-tasks-json' => sub {
    my $params = parse_params;
    unless (defined $params->{queueid} and defined $params->{object}) {
        status 400;
        return send_json [ 0, 'queueid and object required'];
    }

    my $tasks = try { ref $params->{object} ? $params->{object} : $json->decode($params->{object}) } catch { $_ };
    return send_json [ 0, $tasks ] unless ref $tasks;
    return send_json [ 0, 'object param must be a JSON array' ] unless ref $tasks eq 'ARRAY';

    my $queue_id = get_queue_oid($params->{queueid});
    return send_json [ 0, 'Queue not found' ] unless defined $queue_id;

    my $res = create_tasks($queue_id, $tasks);

    my $reponse = {
        success => @{$res->{inserted}} ? 1 : 0,
        ref $res => {%$res},
    };
    unless ($reponse->{success}) {
        status 400;
        $reponse->{error} = 'Unknown error';
    }
    send_json [ $reponse->{success}, scalar @{$res->{inserted}}, @{$res->{inserted}}, $reponse ], convert_blessed => 1;
};

post '/queue-create-tasks-from-query-json' => sub {
    my $params = parse_params;
    unless (defined $params->{queueid} and defined $params->{collection} and defined $params->{jsonfilter} and defined $params->{parameters}) {
        status 400;
        return send_json [ 0, 'queueid, collection, jsonfilter, and parameters required'];
    }

    my $filter = try { ref $params->{jsonfilter} ? $params->{jsonfilter} : $json->decode($params->{jsonfilter}) } catch { $_ };	# {"migration":"foo"}
    return send_json [ 0, $filter ] unless ref $filter;

    my $parameters = try { ref $params->{parameters} ? $params->{parameters} : $json->decode($params->{parameters}) } catch { $_ };	# {"migration":"document.migration","user1":"document.username"}
    return send_json [ 0, $parameters ] unless ref $parameters;

    my $queue_id = get_queue_oid($params->{queueid});
    return send_json [ 0, 'Queue not found' ] unless defined $queue_id;

    my @fields = grep /^document\./, values %$parameters;
    my %fields = map { s/^document\.//; $_ => 1 } @fields;

    my $cursor = $disbatch->mongo->get_collection($params->{collection})->find($filter)->fields(\%fields);
    my @tasks;
    my $error;
    try {
        while (my $object = $cursor->next) {
            my $task = { %$parameters };
            for my $key (keys %$task) {
                if ($task->{$key} =~ /^document\./) {
                    for my $field (@fields) {
                        my $f = quotemeta $field;
                        if ($task->{$key} =~ /^document\.$f$/) {
                            $task->{$key} = $object->{$field};
                        }
                    }
                }
            }
            push @tasks, $task;
        }
    } catch {
        Limper::warning "Could not iterate on collection $params->{collection}: $_";
        $error = "$_";
    };

    return send_json [ 0, $error ] if defined $error;

    my $res = create_tasks($queue_id, \@tasks);	# doing 100k at once only take 12 seconds on my 13" rMBP

    my $reponse = {
        success => @{$res->{inserted}} ? 1 : 0,
        ref $res => {%$res},
    };
    unless ($reponse->{success}) {
        status 400;
        $reponse->{error} = 'Unknown error';
    }
    send_json [ $reponse->{success}, scalar @{$res->{inserted}} ];
#    send_json [ $reponse->{success}, scalar @{$res->{inserted}}, @{$res->{inserted}}, $reponse ], convert_blessed => 1;
};

# This is needed at least to create queues in the web interface (just the keys).
# FIXME: You currently can't create a queue for a constructor unless there is already a queue with that constructor.
# NOTE: post, because of the legacy UI that I don't know how to change.
get post '/queue-prototypes-json' => sub {
    my $example = {
        settings => [],
        'Disbatch::Plugin::Dummy' => {
            name => {
                name => 'perl',
                type => 'string',
                description => 'a Perl expression to evaluate',
                default => 'warn "Hello, world!"',
            }
        }
    };
    my @constructors = try { $disbatch->queues->distinct('constructor')->all } catch { Limper::warning "Could not get current constructors: $_"; () };	# FIXME: on error, this returns an empty list in order to not break current API
    my %constructors = map { $_ => undef } @constructors;
    send_json \%constructors;
};

get '/reload-queues-json' => sub {
    send_json [1];	# for back-compat only. unneeded.
};

# NOTE: get, because of the legacy UI that I don't know how to change.
get post '/search-tasks-json' => sub {
    my $params = parse_params;
    #unless (defined $params->{queue} and defined $params->{filter}) {
    #    status 400;
    #    return send_json [ 0, 'queue and filter required'];
    #}

    $params->{filter} //= {};
    my $filter = try { ref $params->{filter} ? $params->{filter} : $json->decode($params->{filter}) } catch { $_ };
    return send_json [ 0, $params->{json} ? $filter : 'JSON object required for filter' ] unless ref $filter eq 'HASH';

    my $attrs = {};
    $attrs->{limit} = $params->{limit} if $params->{limit};
    $attrs->{skip}  = $params->{skip}  if $params->{skip};

    my $error;
    try {
        $filter->{queue} = MongoDB::OID->new(value => $params->{queue}) if $params->{queue};
        $filter->{_id} = MongoDB::OID->new(value => delete $filter->{id}) if $filter->{id};
    } catch {
        $error = "$_";
        Limper::warning "Bad OID passed: $error";
    };
    return send_json [ 0, $error ] if defined $error;
    $filter->{status} = int $filter->{status} if defined $filter->{status};

    if ($params->{count}) {
        my $count = try { $disbatch->tasks->count($filter) } catch { Limper::warning $_; $_; };
        return send_json [ 0, "$count" ] if ref $count;
        return send_json [ 1, $count ];
    }
    my @tasks = try { $disbatch->tasks->find($filter, $attrs)->all } catch { Limper::warning "Could not find tasks: $_"; () };	# FIXME: on error, this returns an empty list in order to not break current API

    for my $task (@tasks) {
        if ($params->{terse}) {
            $task->{stdout} = '[terse mode]' unless $task->{stdout}->$_isa('MongoDB::OID');
            $task->{stderr} = '[terse mode]' unless $task->{stderr}->$_isa('MongoDB::OID');
        } else {
            $task->{stdout} = try { $disbatch->get_gfs($task->{stdout}) } catch { Limper::warning "Could not get task $task->{_id} stdout: $_"; $task->{stdout} } if $task->{stdout}->$_isa('MongoDB::OID');
            $task->{stderr} = try { $disbatch->get_gfs($task->{stderr}) } catch { Limper::warning "Could not get task $task->{_id} stderr: $_"; $task->{stderr} } if $task->{stderr}->$_isa('MongoDB::OID');
        }

        if ($task->{mtime}) {
            try {
                my $dt = DateTime->from_epoch(epoch => $task->{mtime});
                $task->{mtime_str} = $dt->ymd . ' ' . $dt->hms;
            };
        }

        if ($task->{ctime}) {
            try {
                my $dt = DateTime->from_epoch(epoch => $task->{ctime});
                $task->{ctime_str} = $dt->ymd . ' ' . $dt->hms;
            };
        }
    }

    send_json \@tasks, convert_blessed => 1;
};

get '/' => sub {
    send_file '/index.html';
};

get '/legacy' => sub {
    status 302;
    headers Location => '/legacy/';
    '';
};

get '/legacy/' => sub {
    send_file '/legacy/index.html';
};

get qr{^/} => sub {
    send_file;        # sends request->{uri} by default
};

1;
