#!/usr/bin/perl

use 5.12.0;
use warnings;

use Data::Dumper;
use Getopt::Long;
use IO::Wrap;
use JSON;
use LWP::UserAgent;
use Pod::Usage;
use Text::CSV_XS;
use Text::Table;

my $url = 'http://localhost:8080';
my $username;
my $password;
my $help = 0;

GetOptions(
    'url|u=s'      => \$url,
    'username|n=s' => \$username,
    'password=s'   => \$password,
    'help'         => \$help,
);

pod2usage(-verbose => 2, -exitval => 0) if $help;
pod2usage(1) unless @ARGV;

my $json = JSON->new;
my $ua   = LWP::UserAgent->new;

if (defined $username and defined $password) {
    my ($host) = $url =~ qr{^https?://(.+?)(?:/|$)};
    $ua->credentials($host, 'disbatch', $username, $password);
    say "$host\t$username\t$password";
} elsif (defined $username or defined $password) {
    die "--username and --password must be used together\n";
}

my %commands = (
    status       => \&parse_status,
    queue        => \&parse_queue,
    reloadqueues => \&parse_reloadqueues,
    enclosure    => \&parse_enclosure,
);

sub parse_reloadqueues {
    my ($params) = @_;
    $params->{execute} = \&reloadqueues;
    return 1, 'Reload Queues';
}

sub parse_status {
    my ($params) = @_;
    $params->{execute} = \&status;
    return 1, 'Status';
}

sub parse_enclosure {
    my ($params, @ARGS) = @_;

    my $perl = '';
    while (<STDIN>) {
        $perl .= $_;
    }

    $params->{execute}    = \&queue_tasks;
    $params->{queueid}    = shift @ARGS;
    $params->{collection} = shift @ARGS;
    $params->{filter}     = shift @ARGS;
    unshift @ARGS, $perl;

    $params->{columns} = $json->encode(\@ARGS);

    return 1, undef;
}

sub parse_queue {
    my ($params, @ARGS) = @_;

    my %queue_commands = (
        set    => \&parse_queue_set,
        start  => \&parse_queue_start,
        task   => \&parse_queue_task,
        tasks  => \&parse_queue_tasks,
        search => \&parse_queue_search,
        types  => \&parse_queue_types,
    );

    return 0, "Command '$params->{command}' needs a sub-command.  Options: " . join(' ', keys %queue_commands) if @ARGS < 1 or !defined $ARGS[0];

    my $command = shift @ARGS;
    return 0, "Queue sub-command '$command' does not exist." unless exists $queue_commands{$command};

    my $func = $queue_commands{$command};
    return &$func($params, @ARGS);
}

sub parse_queue_types {
    my ($params, @ARGS) = @_;
    $params->{execute} = \&queue_types;
    return 1, undef;
}

sub parse_queue_start {
    my ($params, @ARGS) = @_;
    return 0, "Start takes 2 arguments:  type & name." if @ARGS != 2;
    $params->{execute} = \&queue_start;
    ($params->{type}, $params->{name}) = @ARGS;
    return 1, undef;
}

sub parse_queue_search {
    my ($params, @ARGS) = @_;
    return 0, "Search takes 2 arguments:  queue & filter." if @ARGS != 2;
    $params->{execute} = \&queue_search;
    ($params->{queue}, $params->{filter}) = @ARGS;
    return 1, undef;
}

sub parse_queue_set {
    my ($params, @ARGS) = @_;
    return 0, "Set takes 3 arguments:  queueid, key & value." if @ARGS != 3;
    $params->{execute} = \&queue_set;
    ($params->{queueid}, $params->{key}, $params->{value}) = @ARGS;
    return 1, undef;
}

sub parse_queue_task {
    my ($params, @ARGS) = @_;
    return 0, "Item takes at least one argument:  queueid.\n" if @ARGS < 1;
    $params->{execute} = \&queue_task;
    $params->{queueid} = shift @ARGS;

    my $state = 0;
    my %parameters;
    my $key;
    while (my $parameter_term = shift @ARGS) {
        if ($state == 0) {
            $key   = $parameter_term;
            $state = 1;
        } elsif ($state == 1) {
            $parameters{$key} = $parameter_term;
            $state = 0;
        }
    }

    return 0, 'Parameters must be an even number of elements to comprise a key/value pair set' if $state == 1;

    $params->{object} = [ \%parameters ];
    return 1, undef;
}

sub parse_queue_tasks {
    my ($params, @ARGS) = @_;
    return 0, "Item takes at least 3 arguments: queueid, collection, filter" if @ARGS < 3;
    $params->{execute}    = \&queue_tasks;
    $params->{queueid}    = shift @ARGS;
    $params->{collection} = shift @ARGS;

    my %filter;
    my $key;
    my $state = 0;
    while ((my $filter_term = shift @ARGS // '') ne '--') {
        return 0, "Filter clause terminator '--' is required (needed twice now as Getopt::Long consumes the first one)" unless $filter_term;
        if ($state == 0) {
            $key   = $filter_term;
            $state = 1;
        } elsif ($state == 1) {
            $filter{$key} = $filter_term;
            $state = 0;
        }
    }

    return 0, 'The filter must be an even number of elements to comprise a key/value pair set' if $state == 1;
    $params->{filter} = \%filter;

    $state = 0;
    my %parameters;
    while (my $parameter_term = shift @ARGS) {
        if ($state == 0) {
            $key   = $parameter_term;
            $state = 1;
        } elsif ($state == 1) {
            $parameters{$key} = $parameter_term;
            $state = 0;
        }
    }

    return 0, 'Parameters must be an even number of elements to comprise a key/value pair set' if $state == 1;
    $params->{parameters} = $json->encode(\%parameters);

    return 1, undef;
}

sub parse_arguments {
    ## No arguments?  Let caller know by returning -1.
    return -1, {} unless @_;

    my ($command, @ARGS) = @_;

    my $parameters = {command => $command};
    unless (exists $commands{$parameters->{command}}) {
        say "No such command '$parameters->{command}'.";
        return 0, $parameters;
    }

    if (my $func = $commands{$parameters->{command}}) {
        my ($ret, $msg) = &$func($parameters, @ARGS);
        if ($ret == 0) {
            say $msg;
            return 0, $parameters;
        }
    }

    return 1, $parameters;
}

sub status {

    #my ($params) = @_;
    my $this_url = "$url/scheduler-json";

    my $r = $ua->get($this_url);
    if ($r->is_success) {
        my $obj   = $json->decode($r->decoded_content);
        my $count = 0;

        my $sep = \' | ';
        my $tl  = Text::Table->new(
            {title => 'ID',         align => 'right'}, $sep,
            {title => 'Type',       align => 'right'}, $sep,
            {title => 'Name',       align => 'right'}, $sep,
            {title => 'Threads',    align => 'right'}, $sep,
            {title => 'To-Do',      align => 'right'}, $sep,
            {title => 'Preemptive', align => 'right'}, $sep,
            {title => 'Done',       align => 'right'}, $sep,
            {title => 'Processing', align => 'right'}, $sep,
            {title => 'Backfill',   align => 'right'}
        );

        for my $queue (@$obj) {
            $tl->add(
                $queue->{id},
                $queue->{constructor},
                $queue->{name},
                $queue->{maxthreads},
                $queue->{tasks_todo},
                $queue->{preemptive},
                $queue->{tasks_done},
                $queue->{tasks_doing},
                $queue->{tasks_backfill}
            );
        }

        #print $t1->draw;
        print $tl->title;
        print $tl->rule('-', '+');
        say $tl->body;
        say "$count total queues.";
    }
}

sub reloadqueues {

    #my ($params) = @_;
    my $this_url = "$url/reload-queues-json";

    my $r = $ua->get($this_url);
    if ($r->is_success) {
        say Dumper $json->decode($r->decoded_content);
    } else {
        say "Unable to connect to $this_url!";
    }
}

sub queue_set {
    my ($params) = @_;
    my $this_url = "$url/set-queue-attr-json";
    my $r        = $ua->post(
        $this_url,
        [
            queueid => $params->{queueid},
            attr    => $params->{key},
            value   => $params->{value},
        ]
    );

    if ($r->is_success) {
        my $obj = $json->decode($r->decoded_content);
        return if $obj->{success};
        say "Couldn't set queue attribute: $obj->{error}";
    } else {
        say "Unable to connect to: $this_url";
    }
}

sub queue_start {
    my ($params) = @_;
    my $this_url = "$url/start-queue-json";
    my $r        = $ua->post(
        $this_url,
        [
            type => $params->{type},
            name => $params->{name},
        ]
    );

    if ($r->is_success) {
        my $obj = $json->decode($r->decoded_content);
        if ($obj->[0] == 1) {
            say "New Queue #$obj->[1]";
            return;
        } else {
            say "Couldn't create queue:  $obj->[1]";
        }
    } else {
        say "Unable to connect to:  $this_url";
    }
}

sub queue_task {
    my ($params) = @_;
    my $this_url = "$url/queue-create-tasks-json";
    my $r        = $ua->post(
        $this_url,
        [
            queueid => $params->{queueid},
            object  => $json->encode($params->{object}),
        ]
    );

    if ($r->is_success) {
        my @ret = @{$json->decode($r->decoded_content)};
        say $r->decoded_content;

        #say "New task #$ret[2]";
    } else {
        say "Unable to connect to:  $this_url";
    }
}

sub queue_tasks {
    my ($params) = @_;
    my $this_url = "$url/queue-create-tasks-from-query-json";
    my $r        = $ua->post(
        $this_url,
        [
            queueid    => $params->{queueid},
            collection => $params->{collection},
            jsonfilter => $json->encode($params->{filter}),
            parameters => $params->{parameters},
        ]
    );

    if ($r->is_success) {
        print $r->decoded_content;

        #my @ret = @{$json->decode($r->decoded_content)};
        #say "New task #$ret[2]";
    } else {
        say "Unable to connect to:  $this_url";
    }
}

sub queue_types {
    my ($params) = @_;
    my $this_url = "$url/queue-prototypes-json";
    my $r        = $ua->post($this_url);

    if ($r->is_success) {

        #print $r->decoded_content;
        my $obj = $json->decode($r->decoded_content);
        my $text = join("\n", keys %$obj);
        say $text;
    } else {
        say "Unable to connect to:  $this_url";
    }
}

sub queue_search {
    my ($params) = @_;
    my $this_url = "$url/search-tasks-json";
    my $r        = $ua->post(
        $this_url,
        [
            queue  => $params->{queue},
            filter => $params->{filter},
        ]
    );

    if ($r->is_success) {
        print $r->decoded_content;

        #my $obj = $json->decode($r->decoded_content);
    } else {
        say "Unable to connect to:  $this_url";
    }
}

my ($ret, $params) = parse_arguments(@ARGV);
exit 1 unless $ret;

pod2usage(-verbose => 2, -exitval => 0) if $ret == -1;

$params->{execute}->($params);

__END__

=head1 NAME

disbatch - Distributed Elastic Batch Processing Framework - Client CLI Tool

=head1 DESCRIPTION

This tool interfaces with the disbatchd process via the JSON API.  It
allows you create new queues, spin off new tasks, and
alter the parameters of the disbatch engine while in operation.

=head1 USAGE

    disbatch.pl [<options>] [<command>...]

=head2 OPTIONS

    -u,--url <URL>             disbatchd JSON API URL
    -n,--username <username>   API username
    -p,--password <password>   API password
    -h,--help                  Display this message

=head2 COMMANDS

    reloadqueues

    status

    queue types
    queue set <queue> <key> <value>
    queue start <type> <name>
    queue task <queue> [<key> <value>, ...]
    queue tasks <queue> <collection> [<filter key> <value>, ...] -- -- [<parameter key> <value>, ...]

    enclosure <queue> <collection> <filter> [<col1>, ...]

=head1 EXAMPLES

=head2 STATUS

The first example is to grab the current running status of the disbatchd
process.  This will list all queues, and the state they are in:

  $ disbatch.pl status
  .------------+-----------+--------+------------+--------+------------.
  | Queue #    | Threads   | To-Do  | Preemptive | Done   | Processing |
  +------------+-----------+--------+------------+--------+------------+
  | 2158219    | 3         | 26013  | 1          | 1427   | 3          |
  '------------+-----------+--------+------------+--------+------------'

=head2 TWEAKING QUEUE SETTINGS

Since there are more than 26,000 tasks, 3 threads seems a bit spartan.  We
can increase that by increasing the maxthread queue attribute:

  $ disbatch.pl queue set 2158219 maxthreads 10

=head2 STARTING A NEW QUEUE

Next, let's create a new queue:

  $ disbatch.pl queue start Synacor::Migration::Plugins::IMAP2IMAP foo
  New Queue #2185663

