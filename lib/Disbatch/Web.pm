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
use Time::Moment;
use Try::Tiny::Retry;
use URL::Encode qw/url_params_mixed/;

my $json = Cpanel::JSON::XS->new->utf8;
my $disbatch;

sub init {
    my $args = { @_ };
    $disbatch = Disbatch->new(class => 'Disbatch::Web', config_file => ($args->{config_file} // '/etc/disbatch/config.json'));
    $disbatch->load_config_file;
    public ($disbatch->{config}{web_root} // '/etc/disbatch/htdocs/');
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
    undef $disbatch->{mongo};
    send_json $disbatch->scheduler_report;
};

post '/set-queue-attr-json' => sub {
    undef $disbatch->{mongo};
    my $params = parse_params;
    my @valid_attributes = qw/threads/;
    unless (grep $_ eq $params->{attr}, @valid_attributes) {
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

sub get_nodes {
    my @nodes = try { $disbatch->nodes->find->sort({node => 1})->all } catch { Limper::warning "Could not get current nodes: $_"; () };	# FIXME: on error, this returns an empty list in order to not break current API
    for my $node (@nodes) {
        $node->{id} = "$node->{_id}";
        delete $node->{_id};
        $node->{timestamp} = "$node->{timestamp}";
    }
    \@nodes;
}

get '/nodes' => sub {
    undef $disbatch->{mongo};
    send_json get_nodes;
};

#  postJSON('/nodes/' + row.rowId , { maxthreads: newValue}, loadQueues);
post qr'^/nodes/(.+)' => sub {
    undef $disbatch->{mongo};
    my $node = $1;
    my $params = parse_params;
    my @valid_params = qw/maxthreads/;
    unless (keys %$params) {
        status 400;
        return send_json {success => 0, error => 'No keys'};
    }
    for my $key (keys %$params) {
        unless (grep $_ eq $key, @valid_params) {
            status 400;
            return send_json {success => 0, error => 'Invalid key', key => $key};
        }
    }
    if (exists $params->{maxthreads} and defined $params->{maxthreads} and $params->{maxthreads} !~ /^\d+$/) {
        status 400;
        return send_json {success => 0, error => 'maxthreads must be a non-negative integer or null'};
    }
    my $res = try {
        $disbatch->nodes->update_one({node => $node}, {'$set' => $params });
    } catch {
        Limper::warning "Could not update node $node: $_";
        $_;
    };
    my $reponse = {
        success => $res->{matched_count} == 1 ? 1 : 0,
        ref $res => {%$res},
    };
    unless ($reponse->{success}) {
        status 400;
        if ($res->$_isa('MongoDB::UpdateResult')) {
            $reponse->{error} = $reponse->{'MongoDB::UpdateResult'};
        } else {
            $reponse->{error} = "$res";
        }
    }
    send_json $reponse;
};

sub get_plugins {
    my @plugins = try { $disbatch->queues->distinct('plugin')->all } catch { Limper::warning "Could not get current plugins: $_"; () };	# FIXME: on error, this returns an empty list in order to not break current API
    my $plugins = $disbatch->{config}{plugins} // [];
    my %plugins = map { $_ => $_ } @plugins, @$plugins;
    \%plugins;
}

post '/start-queue-json' => sub {
    undef $disbatch->{mongo};
    my $params = parse_params;
    unless (defined $params->{type} and defined $params->{name}) {
        status 400;
        return send_json [ 0, 'type and name required'];
    }

    unless (get_plugins->{$params->{type}}) {
        status 400;
        return send_json [ 0, 'unknown type'];
    }

    my $queue = { plugin => $params->{type}, name => $params->{name} };
    my $res = try { $disbatch->queues->insert_one($queue) } catch { Limper::warning "Could not create queue $params->{name}: $_"; $_ };
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
    undef $disbatch->{mongo};
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

# This is needed at least to create queues in the web interface (just the keys).
get '/queue-prototypes-json' => sub {
    undef $disbatch->{mongo};
    send_json get_plugins;
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

# creates a task for given queue _id and params, returning task _id
sub create_tasks {
    my ($queue_id, $tasks) = @_;

    my @tasks = map {
        queue      => $queue_id,
        status     => -2,
        stdout     => undef,
        stderr     => undef,
        node       => undef,
        params     => $_,
        ctime      => Time::Moment->now_utc,
        mtime      => Time::Moment->now_utc,
    }, @$tasks;

    my $res = try { $disbatch->tasks->insert_many(\@tasks) } catch { Limper::warning "Could not create tasks: $_"; $_ };
    $res;
}

post '/queue-create-tasks-json' => sub {
    undef $disbatch->{mongo};
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
    undef $disbatch->{mongo};
    my $params = parse_params;
    unless (defined $params->{queueid} and defined $params->{collection} and defined $params->{jsonfilter} and defined $params->{params}) {
        status 400;
        return send_json [ 0, 'queueid, collection, jsonfilter, and params required'];
    }

    my $filter = try { ref $params->{jsonfilter} ? $params->{jsonfilter} : $json->decode($params->{jsonfilter}) } catch { $_ };	# {"migration":"foo"}
    return send_json [ 0, $filter ] unless ref $filter;

    my $task_params = try { ref $params->{params} ? $params->{params} : $json->decode($params->{params}) } catch { $_ };	# {"migration":"document.migration","user1":"document.username"}
    return send_json [ 0, $task_params ] unless ref $task_params;

    my $queue_id = get_queue_oid($params->{queueid});
    return send_json [ 0, 'Queue not found' ] unless defined $queue_id;

    my @fields = grep /^document\./, values %$task_params;
    my %fields = map { s/^document\.//; $_ => 1 } @fields;

    my $cursor = $disbatch->mongo->coll($params->{collection})->find($filter)->fields(\%fields);
    my @tasks;
    my $error;
    try {
        while (my $object = $cursor->next) {
            my $task = { %$task_params };
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

post '/search-tasks-json' => sub {
    undef $disbatch->{mongo};
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

        for my $type (qw/ctime mtime/) {
            if ($task->{$type}) {
                if (ref $task->{$type}) {
                    if (ref $task->{$type} eq 'Time::Moment' or ref $task->{$type} eq 'DateTime') {
                        $task->{"${type}_str"} = "$task->{$type}";
                        $task->{$type} = $task->{$type}->epoch;
                    } else {
                        # Unknown ref, force to string
                        $task->{"${type}_str"} = "$task->{$type}";
                        $task->{$type} = undef;
                    }
                } else {
                    try {
                        my $dt = DateTime->from_epoch(epoch => $task->{$type});
                        $task->{"${type}_str"} = "$dt";
                    } catch {
                        $task->{"${type}_str"} = "$task->{$type}";
                        $task->{$type} = undef;
                    };
                }
            }
        }
    }

    send_json \@tasks, convert_blessed => 1;
};

get '/' => sub {
    send_file '/index.html';
};

get qr{^/} => sub {
    send_file request->{path};        # sends request->{uri} by default
};

1;

__END__

=encoding utf8

=head1 NAME

Disbatch::Web - web browser and REST interface to Disbatch.

=head1 SUBROUTINES

=over 2

=item init(config_file => $config_file)

Parameters: path to the Disbatch config file. Default is C</etc/disbatch/config.json>.

Initializes the settings for the web server.

Returns nothing.

=item parse_params

Parameters: none

Parses request parameters in the following order:

* from the request body if the Content-Type is C<application/x-www-form-urlencoded>

* from the request body if the Content-Type is C<application/json>

* from the request query otherwise

Returns a C<HASH> of the parsed request parameters.

=item get_nodes

Parameters: none

Returns an array of node objects defined, with C<timestamp> stringified and C<id> the stringified C<_id>.

=item get_plugins

Parameters: none

Returns a C<HASH> of defined queues plugins and any defined C<config.plugins>, where values match the keys.

=item get_queue_oid($queue)

Parameters: Queue ID as a string, or queue name.

Returns a C<MongoDB::OID> object representing this queue's _id.

=item create_tasks($queue_id, $tasks)

Parameters: C<MongoDB::OID> object of the queue _id, C<ARRAY> of task params.

Creates one queued task document for the given queue _id per C<$tasks> entry. Each C<$task> entry becomes the value of the C<params> field of the document.

Returns: the repsonse object from a C<MongoDB::Collection#insert_many> request.

=back

=head1 JSON ROUTES

=over 2

=item GET /scheduler-json

Parameters: none.

Returns array of queues.

Each item has the following keys: id, plugin, name, threads, queued, running, completed

=item POST /set-queue-attr-json

Parameters: C<< { "queueid": queueid, "attr": attr, "value": value } >>

"attr" must be "threads". "value" should be an integer, but no checking is done.

Returns C<< { "success": 1, ref $res: Object } >> or C<< { "success": 0, "error": error } >>

=item GET /nodes

Returns an array of node objects defined, with C<timestamp> stringified and C<id> the stringified C<_id>.

=item POST /nodes/$node

Parameters: C<< { "maxthreads": maxthreads } >>

"maxthreads" is a non-negative integer or null

Returns C<< { "success": 1, ref $res: Object } >> or C<< { "success": 0, ref $res: Object, "error": error_string_or_reponse_object } >>

=item POST /start-queue-json

Parameters: C<< { "name": name, "type": type } >>

"type" is a plugin value.

Returns array: C<< [ success, inserted_id, reponse_object ] >>

=item POST /delete-queue-json

Parameters: C<< { "id": id } >>

Returns array: C<< [ success, error_string_or_reponse_object ] >>

=item GET /queue-prototypes-json

Parameters: none.

Note: You currently can't create a queue for a plugin in the web UI unless there is already a queue with that plugin that this returns.

Returns an object where both keys and values are values of currently defined plugins in queues.

=item POST /queue-create-tasks-json

Parameters: C<< { "queueid": queueid, "object": object } >>

"object" is an array of task parameter objects.

Returns array: C<< [ success, count_inserted, array_of_inserted, reponse_object ] >> or C<< [ 0, error_string ] >>

=item POST /queue-create-tasks-from-query-json

Parameters: C<< { "queueid": queueid, "collection": collection, "jsonfilter": jsonfilter, "params": params } >>

"collection" is the name of the MongoDB collection to query.

"jsonfilter" is the query.

"params" is an object of task params. To insert a document value from a query into the params, prefix the desired key name with C<document.> as a value.

Returns array: C<< [ success, count_inserted ] >> or C<< [ 0, error_string ] >>

=item POST /search-tasks-json

Parameters: C<< { "queue": queue, "filter": filter, "limit": limit, "skip": skip, "count": count, "terse": terse } >>

All parameters are optional.

"filter" is the query. If you want to query by Object ID, use the key "id" and not "_id".

"limit" and "skip" are integers.

"count" and "terse" are booleans.

Returns array of tasks (empty if there is an error in the query), C<< [ status, count_or_error ] >> if "count" is true, or C<< [ 0, error ] >> if other error.

=back

=head1 BROWSER ROUTES

=over 2

=item GET /

Returns the contents of "/index.html" – the queue browser page.

=item GET qr{^/}

Returns the contents of the request path.

=back

=head1 SEE ALSO

L<Disbatch>

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
