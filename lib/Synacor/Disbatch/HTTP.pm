package Synacor::Disbatch::HTTP;

use 5.12.0;
use warnings;

use Apache::Htpasswd;
use Carp;
use Data::Dumper;
use HTTP::Server::Simple::CGI;
use JSON::XS;    # -convert_blessed_universally;
use MIME::Base64;
use POSIX;
use Text::CSV_XS;
use Try::Tiny;

use base qw/ HTTP::Server::Simple::CGI /;

my $json = JSON::XS->new;

my %dispatch = (
    '/scheduler-json'                     => \&scheduler_json,
    '/reload-queues-json'                 => \&reload_queues_json,
    '/set-queue-attr-json'                => \&set_queue_attr_json,
    '/start-queue-json'                   => \&start_queue_json,
    '/delete-queue-json'                  => \&delete_queue_json,
    '/queue-create-tasks-json'            => \&queue_create_tasks_json,
    '/queue-create-tasks-from-query-json' => \&queue_create_tasks_from_query_json,
    '/queue-prototypes-json'              => \&queue_prototypes_json,
    '/search-tasks-json'                  => \&search_tasks_json,
);

sub new {
    my $class = shift;
    my $self  = HTTP::Server::Simple->new(@_);
    $self->{config} = $Synacor::Disbatch::Engine::Engine->{config};
    $self->{base}   = $self->{config}{htdocs_base};
    bless $self, $class;
}

sub do_authenticate {
    my ($self, $cgi) = @_;

    unless (defined $self->{config}{HTTPAuth}) {
        $self->logger->error("No HTTPAuth config section.  Rejecting connection attempts.");
        return 0;
    }

    return 1 if $self->{config}{HTTPAuth}{method} eq 'none';

    if ($self->{config}{HTTPAuth}{method} ne 'basic') {
        $self->logger->error("Rejecting connection attempts.  Unknown HTTPAuth method: $self->{config}{HTTPAuth}{method}");
        return 0;
    }

    unless (defined $self->{config}{HTTPAuth}{passwd}) {
        $self->logger->error("No passwd file specified in HTTPAuth.  Rejecting connection attempts.");
        return 0;
    }

    my $passwd = new Apache::Htpasswd({passwdFile => $self->{config}{HTTPAuth}{passwd}, ReadOnly => 1});
    unless ($passwd) {
        $self->logger->error("Couldn't create Apache::Htpaswd from $self->{config}{HTTPAuth}{passwd}");
        return 0;
    }

    if (($ENV{HTTP_AUTHORIZATION} // '') =~ /^Basic (.*)$/) {
        my ($user, $pass) = split /:/, (MIME::Base64::decode($1) || ':');

        return 1 if $passwd->htCheckPassword($user, $pass);
        $self->logger->error("Authentication error on $user");
        return 0;
    }

    $self->logger->error("Authentication error");
    return 0;
}

sub handle_request {
    my ($self, $cgi) = @_;

    unless ($self->do_authenticate($cgi)) {
        print "HTTP/1.0 401 Not authorized\r\n";
        print $cgi->header(-type => 'text/html', '-WWW-Authenticate' => 'Basic realm="disbatch"');
        print "<h1>Please login</h1>";
        return;
    }

    # log all requests
    my $logstring = $cgi->server_protocol . ' ' . $cgi->request_method . ' ' . $cgi->server_name . ':' . $cgi->server_port . $cgi->request_uri;
    $logstring .= '?' . $cgi->query_string if $cgi->query_string;
    $logstring .= ' from ' . $cgi->remote_host . ' with agent \'' . $cgi->user_agent . '\'';
    $logstring .= ', content type: ' . $cgi->content_type if $cgi->content_type;
    $logstring .= ', referer: ' . $cgi->referer if $cgi->referer;
    my @vars = $cgi->Vars;
    $logstring .= ', params: ' . JSON::XS->new->encode({@vars}) if @vars;
    $logstring .= '.';
    $self->logger->info($logstring);

    my $path = $cgi->path_info();
    $path = '/index.html' if $path eq '/';
    my $handler = $dispatch{$path};
    if (ref $handler eq 'CODE') {
        if ($path =~ /-json$/) {

            #print "HTTP/1.0 200 OK\r\n";
            if ($cgi->param('POSTDATA')) {
                my $postdata = $cgi->param('POSTDATA');
                my $obj      = $json->decode($postdata);
                for my $k (keys %$obj) {
                    $cgi->param(-name => $k, -value => $obj->{$k});
                }
            }

            try {
                my $result = $handler->($cgi) // {};
                print "HTTP/1.0 200 OK\r\n";
                my $converted = $json->allow_blessed->convert_blessed->encode($result);
                print $cgi->header(
                    -type => 'application/json',

                    #-cookie => $cookie,
                );
                print $converted;
                $self->logger->trace("Served '$path'");
            }
            catch {
                print "HTTP/1.0 500 Perl Module Failure\r\n";
                $self->logger->error("Error processing '$path': $_");
                print $cgi->header(
                    -type => 'application/json',

                    #-cookie => $cookie,
                );
                print $json->encode([ 0, "Error executing JSON handler: $_" ]);
            };
        }
    } elsif (-r "$self->{base}/etc/disbatch/htdocs/$path" && $path !~ /\.\./) {
        print "HTTP/1.0 200 OK\r\n";

        my $type = 'text/html';
        $type = 'text/javascript' if $path =~ /\.js$/;
        $type = 'text/css'        if $path =~ /\.css$/;
        $type = 'image/png'       if $path =~ /\.png$/;
        $type = 'image/gif'       if $path =~ /\.gif$/;

        print $cgi->header(-type => $type);
        open my $f, '<', "$self->{base}/etc/disbatch/htdocs/$path";
        print while (<$f>);
    } else {
        print "HTTP/1.0 404 Not found\r\n";
        print $cgi->header(

            #-cookie => $cookie,
        );
        print $cgi->start_html('Not found'), $cgi->h1("Not found: $path"), $cgi->end_html;
    }
}

sub start {
    my ($self) = @_;

    defined(my $pid = fork) or die "fork failed: $!";
    if (!$pid) {
        $self->run;
    }
    $self->{pid} = $pid;
}

sub kill {
    my ($self) = @_;
    if (kill 'KILL', $self->{pid}) {
        print 'killed ' . __PACKAGE__ . " with PID $self->{pid}\n";
    } else {
        print 'could not kill ' . __PACKAGE__ . " with PID $self->{pid}\n";
    }
}

sub scheduler_json {

    #my ($cgi) = @_;
    $Synacor::Disbatch::Engine::EventBus->call_thread('scheduler_report');
}

sub set_queue_attr_json {
    my ($cgi) = @_;

    my @validattrs = qw/ maxthreads preemptive /;

    my $attr = $cgi->param('attr');
    return {success => 0, error => 'Invalid attr'} unless grep $attr, @validattrs;

    my $value = $cgi->param('value');
    return {success => 0, error => 'You must supply a value'} unless defined $value;

    my $queueid = $cgi->param('queueid');
    return {success => 0, error => 'You must supply a queueid'} unless $queueid;

    my ($r, $e) = @{$Synacor::Disbatch::Engine::EventBus->call_thread('set_queue_attr', $queueid, $attr, $value)};
    my $ret = {success => $r};
    $ret->{error} = $e if defined $e;
    $ret;
}

sub list_users_json {
    my ($cgi) = @_;
    $Synacor::Disbatch::Engine::EventBus->call_thread('list_users', $cgi->param('group'), $cgi->param('filter'));
}

sub start_queue_json {
    my ($cgi) = @_;
    $Synacor::Disbatch::Engine::EventBus->call_thread('construct_queue', $cgi->param('type'), $cgi->param('name'));
}

sub queue_create_tasks_json {
    my ($cgi) = @_;

    my $jsobj = $cgi->param('object');
    my $obj   = $json->decode($jsobj);
    $Synacor::Disbatch::Engine::EventBus->call_thread('queue_create_tasks', $cgi->param('queueid'), $obj);
}

sub queue_create_tasks_from_query_json {
    my ($cgi) = @_;
    my $filter = ($cgi->param('jsonfilter')) ? $json->decode($cgi->param('jsonfilter')) : $cgi->param('filter');
    $Synacor::Disbatch::Engine::EventBus->call_thread('queue_create_tasks_from_query', $cgi->param('queueid'), $cgi->param('collection'), $filter, $json->decode($cgi->param('parameters')));
}

sub queue_prototypes_json {
    #my ($cgi) = @_;
    $Synacor::Disbatch::Engine::EventBus->call_thread('queue_prototypes');
}

sub reload_queues_json {
    $Synacor::Disbatch::Engine::EventBus->call_thread('reload_queues');
    [1];
}

sub search_tasks_json {
    my ($cgi) = @_;
    $Synacor::Disbatch::Engine::EventBus->call_thread('search_tasks', $cgi->param('queue'), $cgi->param('filter'), $cgi->param('json') || 0, $cgi->param('limit') || 0, $cgi->param('skip') || 0, $cgi->param('count') || 0, $cgi->param('terse') || 0);
}

sub delete_queue_json {
    my ($cgi) = @_;
    {success => $Synacor::Disbatch::Engine::EventBus->call_thread('delete_queue', $cgi->param('id'))};
}

sub logger {
    my ($self, $type) = @_;
    my $classname = ref $self;
    $classname =~ s/^.*:://;

    my $logger = defined $type ? "disbatch.httpd.$type" : "disbatch.httpd";

    unless ($self->{log4perl_initialised}) {
        Log::Log4perl::init_and_watch($self->{config}{log4perl_conf}, $self->{config}{log4perl_reload});
        $self->{log4perl_initialised} = 1;
        $self->{loggers}              = {};
    }

    $self->{loggers}{$logger} //= Log::Log4perl->get_logger($logger);
    $self->{loggers}{$logger};
}

1;

__END__

=head1 NAME

HTTP Server - API & document server

=head1 OVERVIEW

A simple web-server built atop HTTP::Server::Simple::CGI, this is the
primary vector to telling the execution engine what to do.

Nearly every operation this software can perform has a JSON API call.

Implementing a new API call is trivial:  simply write a subroutine which
accepts a CGI object, return a hashref or arrayref, add it to the %dispatch
hash, and your new API call is ready.

=head1 METHODS

=over 1

=item new()

Instantiate new web-server.

=item handle_request()

This method overrides the HTTP::Server::Simple default, and is called when a request is made.

It maintains a JSON object, and makes JSON API calls (translating the
responses to JSON for output) if the request path ends in "-json".

If the request path does not end in "-json", it will attempt to grab a file
out of the /etc/disbatch/htdocs/ directory.

=item start()

Starts a new thread for the web-server, initialises itself, and returns PID.

=back

=item kill()

Kills thread for the web-server.

=back

=head1 JSON API Calls

=over 1

=item /scheduler-json

Enumerate through queues, collecting statistics on items to-do, complete and in-progress. Also includes maxthreads & preemptive. Callable via eventbus.

=item /set-queue-attr-json

Sets a queue attribute.

Parameters:

    attr		Attribute name
    value		Attribute value

Valid attributes: maxthreads preemptive

=item /list-users-json

Returns an array of users from a group, optionally with a Perl expression filter.

Parameters:

    group		Group name
    filter		Perl expression filter

Filter examples:

    1				All users
    $username =~ /^[Aa]/	Users beginning with a or A
    $user.password eq 'foo'	User password is foo

=item /start-queue-json

Instansiate & commence a new queue.

Parameters:

    type		Class of queue to create
    name		Name of new queue (unused)

=item /queue-create-items-json

Create & queue items under a queue from a JSON object.

Parameters:

    queueid		Task ID
    object		Javascript Object containing queues

=item /queue-create-tasks-from-users-json

Create new tasks and add them to a queue queue using the result of a user filter to populate & substitute parameter data.

Parameters:

    queueid		Task ID
    group		Group name
    filter		Perl expression filter
    columns		JSON object containing parameters to create tasks with

=item /queue-prototypes-json

Returns a hash of the queues with each parameter defined.

=item /reload-queues-json

Ask engine to reload the Perl queue classes.

=item /search-tasks-json

Search through tasks.

=item /delete-queue-json

Delete a Queue.

