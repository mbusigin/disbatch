#!/usr/bin/env perl

use Test::More;

use 5.12.0;
use warnings;

use Cpanel::JSON::XS;
use Data::Dumper;
use File::Path qw/remove_tree/;
use File::Slurp;
use MongoDB;
use Net::HTTP::Client;
use POSIX qw(setsid);
use Try::Tiny::Retry;

use lib 'lib';
use Disbatch;
use Disbatch::Roles;
use Disbatch::Web;

my $use_ssl = $ENV{USE_SSL} // 1;
my $use_auth = $ENV{USE_AUTH} // 1;

unless ($ENV{AUTHOR_TESTING}) {
    plan skip_all => 'Skipping author tests';
    exit;
}

sub get_free_port {
    my ($port, $sock);
    do {
        $port = int rand()*32767+32768;
        $sock = IO::Socket::INET->new(Listen => 1, ReuseAddr => 1, LocalAddr => 'localhost', LocalPort => $port, Proto => 'tcp')
                or warn "\n# cannot bind to port $port: $!";
    } while (!defined $sock);
    $sock->shutdown(2);
    $sock->close();
    $port;
}

my $mongoport = get_free_port;

# define config and make up a database name:
my $config = {
    mongohost => "localhost:$mongoport",
    database => "disbatch_test$$" . int(rand(10000)),
    attributes => { ssl => { SSL_verify_mode => 0x00 } },
    auth => {
        disbatchd => 'qwerty1',		# { username => 'disbatchd', password => 'qwerty1' },
        disbatch_web => 'qwerty2',	# { username => 'disbatch_web', password => 'qwerty2' },
        task_runner => 'qwerty3',	# { username => 'task_runner', password => 'qwerty3' },
        plugin => 'qwerty4',		# { username => 'plugin', password => 'qwerty3' },
    },
    plugins => [ 'Disbatch::Plugin::Demo' ],
    web_root => 'etc/disbatch/htdocs/',
    task_runner => './bin/task_runner',
    log4perl => {
        level => 'TRACE',
        appenders => {
            filelog => {
                type => 'Log::Log4perl::Appender::File',
                layout => '[%p] %d %F{1} %L %C %c> %m %n',
                args => { filename => 'disbatchd.log' },
            },
            screenlog => {
                type => 'Log::Log4perl::Appender::ScreenColoredLevels',
                layout => '[%p] %d %F{1} %L %C %c> %m %n',
                args => { },
            }
        }
    },
};
delete $config->{auth} unless $use_auth;
delete $config->{attributes} unless $use_ssl;

mkdir "/tmp/$config->{database}";
my $config_file = "/tmp/$config->{database}/config.json";
write_file $config_file, encode_json $config;

say "database = $config->{database}";

my @mongo_args = (
    '--logpath' => "/tmp/$config->{database}/mongod.log",
    '--dbpath' => "/tmp/$config->{database}/",
    '--pidfilepath' => "/tmp/$config->{database}/mongod.pid",
    '--port' => $mongoport,
    '--noprealloc',
    '--nojournal',
    '--fork'
);
push @mongo_args, $use_auth ? '--auth' : '--noauth';
push @mongo_args, '--sslMode' => 'requireSSL', '--sslPEMKeyFile' => 't/test-cert.pem', if $use_ssl;
my $mongo_args = join ' ', @mongo_args;
say `mongod $mongo_args`;	# FIXME: blegh

# Get test database, authed as root:
my $attributes = {};
$attributes->{ssl} = $config->{attributes}{ssl} if $use_ssl;
if ($use_auth) {
    my $admin = MongoDB->connect($config->{mongohost}, $attributes)->get_database('admin');
    retry { $admin->run_command([createUser => 'root', pwd => 'kjfiwey76r3gjm', roles => [ { role => 'root', db => 'admin' } ]]) } catch { die $_ };
    $attributes->{username} = 'root';
    $attributes->{password} = 'kjfiwey76r3gjm';
}
my $test_db_root = retry { MongoDB->connect($config->{mongohost}, $attributes)->get_database($config->{database}) } catch { die $_ };

# Create roles and users for a database:
my $plugin_perms = { reports => [ 'insert' ] };	# minimal permissions for Disbatch::Plugin::Demo
Disbatch::Roles->new(db => $test_db_root, plugin_perms => $plugin_perms, %{$config->{auth}})->create_roles_and_users if $use_auth;

# Create users collection:
for my $username (qw/ foo bar /) {
    retry { $test_db_root->coll('users')->insert({username => $username, migration => 'test'}) } catch { die $_ };
}

# Ensure indexes:
my $disbatch = Disbatch->new(class => 'Disbatch', config_file => $config_file);
$disbatch->load_config;
$disbatch->ensure_indexes;

# make sure node document exists:
$disbatch->update_node_status;	# FIXME: add tests for this

#####################################
# Start web:
sub daemonize {
    open STDIN, '<', '/dev/null'  or die "can't read /dev/null: $!";
    open STDOUT, '>', '/dev/null' or die "can't write to /dev/null: $!";
    defined(my $pid = fork)       or die "can't fork: $!";
    return $pid if $pid;
    setsid != -1                  or die "Can't start a new session: $!";
    open STDERR, '>&', 'STDOUT'   or die "can't dup stdout: $!";
    0;
}

my $webport = get_free_port;

my $webpid = daemonize();
if ($webpid == 0) {
    Disbatch::Web::init(config_file => $config_file);
    Disbatch::Web::limp({workers => 5}, LocalPort => $webport);
    die "This shouldn't have happened";
} else {
    # Run tests:
    my $uri = "localhost:$webport";
    my ($res, $data, $content);

    my $queueid;	# OID
    my $threads;	# integer
    my $name;	# queue name
    my $plugin;	# plugin name
    my $object;	# array of task parameter objects
    my $collection;	# name of the MongoDB collection to query
    my $filter;	# query. If you want to query by OID, use the key "id" and not "_id"
    my $params;	# object of task params. To insert a document value from a query into the params, prefix the desired key name with "document." as a value.
    my $limit;	# integer
    my $skip;	# integer
    my $count;	# boolean
    my $terse;	# boolean

    $name = 'test_queue';
    $plugin = $config->{plugins}[0];

    # make sure web server is running:
    retry { Net::HTTP::Client->request(GET => "$uri/") } catch { die $_ };

    ### BROWSER ROUTES ###

    # Returns the contents of "/index.html" – the queue browser page.
    $res = Net::HTTP::Client->request(GET => "$uri/");
    is $res->status_line, '200 OK', '200 status';
    is $res->content_type, 'text/html', 'text/html';

    # Returns the contents of the request path.
    $res = Net::HTTP::Client->request(GET => "$uri/js/queues.js");
    is $res->status_line, '200 OK', '200 status';
    is $res->content_type, 'application/javascript', 'application/javascript';

    ### GET JSON ROUTES ####

    # Returns array of queues.
    # Each item has the following keys: id, plugin, name, threads, queued, running, completed
    $res = Net::HTTP::Client->request(GET => "$uri/scheduler-json");
    is $res->status_line, '200 OK', '200 status';
    is $res->content_type, 'application/json', 'application/json';
    is $res->content, '[]', 'empty array';

    # Returns an object where both keys and values are values of currently defined plugins in queues.
    $res = Net::HTTP::Client->request(GET => "$uri/queue-prototypes-json");
    is $res->status_line, '200 OK', '200 status';
    is $res->content_type, 'application/json', 'application/json';
    is $res->content, "{\"$plugin\":\"$plugin\"}", 'empty hash';

    ### POST JSON ROUTES ####

    # Returns array: C<< [ success, inserted_id, $reponse_object ] >>
    $data = { name => $name, type => $plugin };
    $res = Net::HTTP::Client->request(POST => "$uri/start-queue-json", 'Content-Type' => 'application/json', encode_json($data));
    is $res->status_line, '200 OK', '200 status';
    is $res->content_type, 'application/json', 'application/json';
    $content = decode_json($res->content);
    is ref $content, 'ARRAY', 'content is ARRAY';
    is $content->[0], 1, 'success';
    $queueid = $content->[1]{'$oid'};

    # Returns array: C<< [ success, count_inserted, array_of_inserted, $reponse_object ] >> or C<< [ 0, $error_string ] >>
    # "object" is an array of task parameter objects.
    $data = { queueid => $queueid, object => [ {commands => 'a'}, {commands => 'b'}, {commands => 'c'}] };
    $res = Net::HTTP::Client->request(POST => "$uri/queue-create-tasks-json", 'Content-Type' => 'application/json', encode_json($data));
    is $res->status_line, '200 OK', '200 status';
    is $res->content_type, 'application/json', 'application/json';
    $content = decode_json($res->content);
    is ref $content, 'ARRAY', 'content is ARRAY';
    is $content->[0], 1, 'success';
    is $content->[1], 3, 'count';
    my @task_ids = map { $_->{_id}{'$oid'} } @{$content}[2..4];

    $data = { queue => $queueid, count => 1 };
    $res = Net::HTTP::Client->request(POST => "$uri/search-tasks-json", 'Content-Type' => 'application/json', encode_json($data));
    is $res->status_line, '200 OK', '200 status';
    is $res->content_type, 'application/json', 'application/json';
    $content = decode_json($res->content);
    is ref $content, 'ARRAY', 'content is ARRAY';
    is $content->[0], 1, 'success';
    is $content->[1], 3, 'count';

    $data = { queue => $queueid, count => 1, filter => { 'params.commands' => 'b' } };
    $res = Net::HTTP::Client->request(POST => "$uri/search-tasks-json", 'Content-Type' => 'application/json', encode_json($data));
    is $res->status_line, '200 OK', '200 status';
    is $res->content_type, 'application/json', 'application/json';
    $content = decode_json($res->content);
    is ref $content, 'ARRAY', 'content is ARRAY';
    is $content->[0], 1, 'success';
    is $content->[1], 1, 'count';

    # Returns array of tasks (empty if there is an error in the query), C<< [ status, $count_or_error ] >> if "count" is true, or C<< [ 0, error ] >> if other error.
    # All parameters are optional.
    # "filter" is the query. If you want to query by Object ID, use the key "id" and not "_id".
    # "limit" and "skip" are integers.
    # "count" and "terse" are booleans.
    $data = { queue => $queueid, filter => $filter, limit => $limit, skip => $skip, terse => $terse };
    $res = Net::HTTP::Client->request(POST => "$uri/search-tasks-json", 'Content-Type' => 'application/json', encode_json($data));
    is $res->status_line, '200 OK', '200 status';
    is $res->content_type, 'application/json', 'application/json';
    $content = decode_json($res->content);
    is ref $content, 'ARRAY', 'content is ARRAY';
    #say Dumper $content;

    # Returns array: C<< [ success, count_inserted ] >> or C<< [ 0, $error_string ] >>
    # "collection" is the name of the MongoDB collection to query.
    # "jsonfilter" is the query.
    # "params" is an object of task params. To insert a document value from a query into the params, prefix the desired key name with C<document.> as a value.
    $collection = 'users';
    $filter = { migration => 'test' };
    $params = { user1 => 'document.username', migration => 'document.migration', commands => '*' };
    $data =  { queueid => $queueid, collection => $collection, jsonfilter => $filter, params => $params };
    $res = Net::HTTP::Client->request(POST => "$uri/queue-create-tasks-from-query-json", 'Content-Type' => 'application/json', encode_json($data));
    is $res->status_line, '200 OK', '200 status';
    is $res->content_type, 'application/json', 'application/json';
    $content = decode_json($res->content);
    is ref $content, 'ARRAY', 'content is ARRAY';
    is $content->[0], 1, 'success';
    is $content->[1], 2, 'count inserted';

    $res = Net::HTTP::Client->request(GET => "$uri/scheduler-json");
    is $res->status_line, '200 OK', '200 status';
    is $res->content_type, 'application/json', 'application/json';
    $content = decode_json($res->content);
    is ref $content, 'ARRAY', 'content is ARRAY';
    is scalar @$content, 1, 'size';
    is $content->[0]{id}, $queueid, 'id';
    is $content->[0]{plugin}, $plugin, 'plugin';
    is $content->[0]{name}, 'test_queue', 'name';
    is $content->[0]{threads}, undef, 'threads';
    is $content->[0]{queued}, 5, 'queued';
    is $content->[0]{running}, 0, 'running';
    is $content->[0]{completed}, 0, 'completed';

    # Returns C<< { "success": 1, ref $res: Object } >> or C<< { "success": 0, "error": error } >>
    $data = { queueid => $queueid, attr => 'threads', value => 1 };
    $res = Net::HTTP::Client->request(POST => "$uri/set-queue-attr-json", 'Content-Type' => 'application/json', encode_json($data));
    is $res->status_line, '200 OK', '200 status';
    is $res->content_type, 'application/json', 'application/json';
    $content = decode_json($res->content);
    is ref $content, 'HASH', 'content is HASH';
    is $content->{success}, 1, 'success';

    $res = Net::HTTP::Client->request(GET => "$uri/scheduler-json");
    is $res->status_line, '200 OK', '200 status';
    is $res->content_type, 'application/json', 'application/json';
    $content = decode_json($res->content);
    is ref $content, 'ARRAY', 'content is ARRAY';
    is scalar @$content, 1, 'size';
    is $content->[0]{threads}, 1, 'threads';

    # Returns an object where both keys and values are values of currently defined plugins in queues.
    $res = Net::HTTP::Client->request(GET => "$uri/queue-prototypes-json");
    is $res->status_line, '200 OK', '200 status';
    is $res->content_type, 'application/json', 'application/json';
    is $res->content, "{\"$plugin\":\"$plugin\"}", 'defined plugins';

    # This will run 1 task:
    $disbatch->validate_plugins;
    $disbatch->process_queues;

    # Make sure queue count updated:
    $data = { queue => $queueid, count => 1, filter => { status => -2 } };
    $res = Net::HTTP::Client->request(POST => "$uri/search-tasks-json", 'Content-Type' => 'application/json', encode_json($data));
    is $res->status_line, '200 OK', '200 status';
    is $res->content_type, 'application/json', 'application/json';
    $content = decode_json($res->content);
    is ref $content, 'ARRAY', 'content is ARRAY';
    is $content->[0], 1, 'success';
    is $content->[1], 4, 'count';

    # Get report for task:
    my $report = retry { $disbatch->mongo->coll('reports')->find_one() or die 'No report found' } catch { warn $_; {} };	# status done task_id
    is $report->{status}, 'SUCCESS', 'report success';

    # Get task of report:
    my $task = $disbatch->tasks->find_one({_id => $report->{task_id}});
    is $task->{status}, 1, 'task success';

    # Returns array: C<< [ success, $error_string_or_reponse_object ] >>
    $data = { id => $queueid };
    $res = Net::HTTP::Client->request(POST => "$uri/delete-queue-json", 'Content-Type' => 'application/json', encode_json($data));
    is $res->status_line, '200 OK', '200 status';
    is $res->content_type, 'application/json', 'application/json';
    $content = decode_json($res->content);
    is ref $content, 'ARRAY', 'content is ARRAY';
    is $content->[0], 1, 'success';
    is $content->[1]{'MongoDB::DeleteResult'}{deleted_count}, 1, 'count';

    done_testing;
}

END {
    # Cleanup:
    if (defined $config and $config->{database}) {
        kill -9, $webpid if $webpid;
        my $pidfile = "/tmp/$config->{database}/mongod.pid";
        if (-e $pidfile) {
            my $mongopid = read_file $pidfile;
            chomp $mongopid;
            kill 9, $mongopid;
        }
        remove_tree "/tmp/$config->{database}";
    }
}
