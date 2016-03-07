#!/usr/bin/env perl

use Test::More;

use 5.12.0;
use warnings;

use Cpanel::JSON::XS;
use Data::Dumper;
use File::Slurp;
use MongoDB;
use Net::HTTP::Client;
use POSIX qw(setsid);
use Try::Tiny::Retry;

use lib 'lib';
use Disbatch;
use Disbatch::Roles;
use Disbatch::Web;

unless ($ENV{AUTHOR_TESTING}) {
    plan skip_all => 'Skipping author tests';
    exit;
}
unless ($ENV{MONGOPASS}) {
    BAIL_OUT 'Must pass MONGOPASS=<password> for MongoDB root user';
}

sub mongo {
    my ($host, $database, $username, $password, $ssl) = @_;
    my $attributes = {
        ssl => $ssl,
        username => $username,
        password => $password,
        #db_name => $database,
    };
    MongoDB->connect($host, $attributes)->get_database($database);
}

# define config and make up a database name:
my $config = {
    mongohost => 'mongodb://127.0.0.1:27017',
    database => "disbatch_test$$" . int(rand(10000)),
    attributes => { ssl => { SSL_verify_mode => 0x00 }, },
    auth => {
        disbatchd => 'qwerty1',		# { username => 'disbatchd', password => 'qwerty1' },
        disbatch_web => 'qwerty1',	# { username => 'disbatch_web', password => 'qwerty2' },
        task_runner => 'qwerty1',	# { username => 'task_runner', password => 'qwerty3' },
    },
    default_config => 'development',
    web_root => 'etc/disbatch/htdocs/',
    task_runner => './bin/task_runner',
};

my $config_file = "/tmp/$config->{database}.json";
write_file $config_file, encode_json $config;

say "database = $config->{database}";

# Get test database, authed as root:
my $test_db_root = MongoDB->connect('localhost', { username => ($ENV{MONGOROOT} // 'root'), password => $ENV{MONGOPASS}, ssl => {SSL_verify_mode => 0x00} })->get_database($config->{database});

# Create roles and users for a database:
Disbatch::Roles->new(db => $test_db_root, %{$config->{auth}})->create_roles_and_users;

# Create users collection:
for my $username (qw/ foo bar /) {
    $test_db_root->coll('users')->insert({username => $username, migration => 'test'});
}

# Ensure indexes:
my $disbatch = Disbatch->new(class => 'Disbatch', config_file => $config_file);
$disbatch->load_config;
$disbatch->ensure_indexes;

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

my ($port, $sock);

do {
    $port = int rand()*32767+32768;
    $sock = IO::Socket::INET->new(Listen => 5, ReuseAddr => 1, LocalAddr => 'localhost', LocalPort => $port, Proto => 'tcp')
            or warn "\n# cannot bind to port $port: $!";
} while (!defined $sock);
$sock->shutdown(2);
$sock->close();

my $pid = daemonize();
if ($pid == 0) {
    Disbatch::Web::init(config_file => $config_file);
    Disbatch::Web::limp({workers => 5}, LocalPort => $port);
    die "This shouldn't have happened";
} else {
    # Run tests:
    my $uri = "localhost:$port";
    my ($res, $data, $content);

    my $queueid;	# OID
    my $maxthreads;	# integer
    my $name;	# queue name
    my $plugin;	# plugin name
    my $object;	# array of task parameter objects
    my $collection;	# name of the MongoDB collection to query
    my $filter;	# query. If you want to query by OID, use the key "id" and not "_id"
    my $parameters;	# object of task parameters. To insert a document value from a query into the parameters, prefix the desired key name with "document." as a value.
    my $limit;	# integer
    my $skip;	# integer
    my $count;	# boolean
    my $terse;	# boolean

    $name = 'test_queue';
    $plugin = 'Synacor::Migration::Plugins::Dummy';

    # make sure web server is running:
    retry { Net::HTTP::Client->request(GET => "$uri/") } catch { die $_ };

    ### BROWSER ROUTES ###

    # Returns the contents of "/index.html" – the queue browser page.
    $res = Net::HTTP::Client->request(GET => "$uri/");
    is $res->status_line, '200 OK', '200 status';
    is $res->content_type, 'text/html', 'text/html';

    # Returns a 302 to "/legacy/".
    $res = Net::HTTP::Client->request(GET => "$uri/legacy");
    is $res->status_line, '302 Found', '302 status';
    is $res->header('Location'), '/legacy/', 'Location: /legacy/';

    # Returns the contents of "/legacy/index.html" –the legacy queue browser page.
    $res = Net::HTTP::Client->request(GET => "$uri/legacy/");
    is $res->status_line, '200 OK', '200 status';
    is $res->content_type, 'text/html', 'text/html';

    # Returns the contents of the request path.
    $res = Net::HTTP::Client->request(GET => "$uri/js/queues.js");
    is $res->status_line, '200 OK', '200 status';
    is $res->content_type, 'application/javascript', 'application/javascript';

    ### GET JSON ROUTES ####

    # Returns array of queues.
    # Each item has the following keys: id, tasks_todo, tasks_done, tasks_doing, maxthreads, name, constructor
    # For legacy reasons, the following key/value pairs are also included: preemptive: 1, tasks_backfill: 0
    $res = Net::HTTP::Client->request(GET => "$uri/scheduler-json");
    is $res->status_line, '200 OK', '200 status';
    is $res->content_type, 'application/json', 'application/json';
    is $res->content, '[]', 'empty array';

    # Returns an object where both keys and values are values of currently defined constructors in queues.
    $res = Net::HTTP::Client->request(GET => "$uri/queue-prototypes-json");
    is $res->status_line, '200 OK', '200 status';
    is $res->content_type, 'application/json', 'application/json';
    is $res->content, '{}', 'empty hash';

    $res = Net::HTTP::Client->request(GET => "$uri/reload-queues-json");
    is $res->status_line, '200 OK', '200 status';
    is $res->content_type, 'application/json', 'application/json';
    is $res->content, '[1]', 'Deprecated – for back-compat only. NOOP.';

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

    $data = { queue => $queueid, count => 1, filter => { 'parameters.commands' => 'b' } };
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
    # "parameters" is an object of task parameters. To insert a document value from a query into the parameters, prefix the desired key name with C<document.> as a value.
    $collection = 'users';
    $filter = { migration => 'test' };
    $parameters = { user1 => 'document.username', migration => 'document.migration', commands => '*' };
    $data =  { queueid => $queueid, collection => $collection, jsonfilter => $filter, parameters => $parameters };
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
    is $content->[0]{maxthreads}, undef, 'maxthreads';
    is $content->[0]{tasks_doing}, 0, 'tasks_doing';
    is $content->[0]{tasks_done}, 0, 'tasks_done';
    is $content->[0]{tasks_todo}, 5, 'tasks_todo';
    is $content->[0]{preemptive}, 1, 'preemptive';
    is $content->[0]{tasks_backfill}, 0, 'tasks_backfill';
    is $content->[0]{constructor}, 'Synacor::Migration::Plugins::Dummy', 'constructor';
    is $content->[0]{name}, 'test_queue', 'name';
    is $content->[0]{id}, $queueid, 'id';

    # Returns C<< { "success": 1, ref $res: Object } >> or C<< { "success": 0, "error": error } >>
    $data = { queueid => $queueid, attr => 'maxthreads', value => 1 };
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
    is $content->[0]{maxthreads}, 1, 'maxthreads';

    # Returns an object where both keys and values are values of currently defined constructors in queues.
    $res = Net::HTTP::Client->request(GET => "$uri/queue-prototypes-json");
    is $res->status_line, '200 OK', '200 status';
    is $res->content_type, 'application/json', 'application/json';
    is $res->content, '{"Synacor::Migration::Plugins::Dummy":"Synacor::Migration::Plugins::Dummy"}', 'defined plugins';

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
    my $report = retry { $disbatch->mongo->coll('reports')->find_one() or die 'No report found' } catch { warn $_ };	# status done task_id
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

    # Stop web:
    kill -9, $pid;

    # Delete config file:
    unlink $config_file;

    # Drop database:
    $test_db_root->drop;
}
