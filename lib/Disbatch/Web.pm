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
use MongoDB 1.0.0;
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
    my $res = $disbatch->queues->update_one({_id => MongoDB::OID->new(value => $params->{queueid})}, {'$set' => { $params->{attr} => $params->{value} }});
    my $reponse = {
        success => $res->{matched_count} == 1 ? 1 : 0,
        ref $res => {%$res},
    };
    unless ($reponse->{success}) {
        status 400;
        $reponse->{error} = $disbatch->queues->count({_id => MongoDB::OID->new(value => $params->{queueid})}) ? 'Unknown error' : 'Unknown queue';
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
    my $res = $disbatch->queues->insert_one($queue);
    my $reponse = {
        success => defined $res->{inserted_id} ? 1 : 0,
        ref $res => {%$res},
    };
    unless ($reponse->{success}) {
        status 400;
        $reponse->{error} = 'Unknown error';
    }
    send_json [ $reponse->{success}, $reponse->{ref $res}{inserted_id}, $reponse ], convert_blessed => 1;
};

post '/delete-queue-json' => sub {
    my $params = parse_params;
    unless (defined $params->{id}) {
        status 400;
        return send_json [ 0, 'id required'];
    }

    my $res = $disbatch->queues->delete_one({_id => MongoDB::OID->new(value => $params->{id})});
    my $reponse = {
        success => $res->{deleted_count} ? 1 : 0,
        ref $res => {%$res},
    };
    unless ($reponse->{success}) {
        status 400;
        $reponse->{error} = 'Unknown error';
    }
    send_json [ $reponse->{success}, $reponse ];
};

sub get_queue_oid {
    my ($queue) = @_;
    my $queue_id = try {
        MongoDB::OID->new(value => $queue);
    } catch {
        my $q = $disbatch->queues->find_one({name => $queue});
        defined $q ? $q->{_id} : undef;
    };
}

# creates a task for given queue _id and parameters, returning task _id
sub create_tasks {
    my ($queue_id, $tasks) = @_;

    my @tasks = map {
        queue      => $queue_id,
        status     => -2,
        stdout     => '',
        stderr     => '',
        node       => -1,
        parameters => $_,
        ctime      => time,
        mtime      => 0,
    }, @$tasks;

    my $res = $disbatch->tasks->insert_many(\@tasks);
    $disbatch->queues->update_one({_id => $queue_id}, {'$inc' => {count_total => scalar @{$res->{inserted}}, count_todo => scalar @{$res->{inserted}}}});
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
    my %constructors = map { $_ => undef } $disbatch->queues->distinct('constructor')->all;
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

    $filter->{queue} = MongoDB::OID->new(value => $params->{queue}) if $params->{queue};
    $filter->{_id} = MongoDB::OID->new(value => delete $filter->{id}) if $filter->{id};
    $filter->{status} = int $filter->{status} if defined $filter->{status};

    if ($params->{count}) {
        return send_json [ 1, $disbatch->tasks->count($filter) ];
    }
    my @tasks = $disbatch->tasks->find($filter, $attrs)->all;

    for my $task (@tasks) {
        if ($params->{terse}) {
            $task->{stdout} = '[terse mode]';
            $task->{stderr} = '[terse mode]';
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
