package Synacor::Disbatch::HTTP;

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

=cut

use strict;
use Carp;
use Try::Tiny;
use HTTP::Server::Simple::CGI;
use Data::Dumper;
use JSON::XS; # -convert_blessed_universally;
use Text::CSV_XS;
use POSIX;
use MIME::Base64;
use Apache::Htpasswd;

use base qw(HTTP::Server::Simple::CGI);


my $json = undef;


my %dispatch =
(
    '/scheduler-json'				=> \&scheduler_json,
    '/reload-queues-json'			=> \&reload_queues_json,
    '/set-queue-attr-json'			=> \&set_queue_attr_json,
    '/start-queue-json'				=> \&start_queue_json,
    '/delete-queue-json'			=> \&delete_queue_json,
    '/queue-create-tasks-json'			=> \&queue_create_tasks_json,
    '/queue-create-tasks-from-query-json'	=> \&queue_create_tasks_from_query_json,
    '/queue-prototypes-json'			=> \&queue_prototypes_json,
    '/search-tasks-json'			=> \&search_tasks_json,
);


=item new()

Instantiate new web-server.

=cut

sub new
{
    my $class = shift;
    my $self = HTTP::Server::Simple->new( @_ );
    $self->{ 'config' } = $Synacor::Disbatch::Engine::Engine->{config};
    $self->{base} = $self->{config}{htdocs_base};
    return bless $self, $class;
}

sub do_authenticate {
    my $self = shift;
    my $cgi = shift;

    if ( !defined($self->{config}->{HTTPAuth}) )
    {
        $self->logger->error( "No HTTPAuth config section.  Rejecting connection attempts." );
        return 0;
    }
    
    return 1 if $self->{config}->{HTTPAuth}->{method} eq 'none';

    if ( $self->{config}->{HTTPAuth}->{method} ne 'basic' )
    {
        $self->logger->error( "Rejecting connection attempts.  Unknown HTTPAuth method: " . $self->{config}->{HTTPAuth}->{method} );
        return 0;
    }

    if ( !defined($self->{config}->{HTTPAuth}->{passwd}) )
    {
        $self->logger->error( "No passwd file specified in HTTPAuth.  Rejecting connection attempts." );
        return 0;
    }
    
    my $passwd = new Apache::Htpasswd( {passwdFile => $self->{config}->{HTTPAuth}->{passwd},
                                 ReadOnly   => 1}
                                );
    if ( !$passwd )
    {
        $self->logger->error( "Couldn't create Apache::Htpaswd from " . $self->{config}->{HTTPAuth}->{passwd} );
        return 0;
    }
    
    
    if (($ENV{HTTP_AUTHORIZATION} || '') =~ /^Basic (.*?)$/) {
        my($user, $pass) = split /:/, (MIME::Base64::decode($1) || ':');
        
        return 1 if $passwd->htCheckPassword( $user, $pass );
        $self->logger->error( "Authentication error on $user" );
        return 0;
    }

    $self->logger->error( "Authentication error" );
    return 0;
}


=item handle_request()

This method overrides the HTTP::Server::Simple default, and is called when a request is made.

It maintains a JSON object, and makes JSON API calls (translating the
responses to JSON for output) if the request path ends in "-json".

If the request path does not end in "-json", it will attempt to grab a file
out of the /etc/disbatch/htdocs/ directory.

=cut

sub handle_request
{
    my $self = shift;
    my $cgi  = shift;

    if ( !$self->do_authenticate($cgi) )
    {
        print "HTTP/1.0 401 Not authorized\r\n";
        print $cgi->header(
                         -type => 'text/html',
                         '-WWW-Authenticate' => 'Basic realm="disbatch"',
                    ), "<h1>Please login</h1>";
        return;
    }

    
    $json = new JSON::XS if ( !$json );
    my $path = $cgi->path_info();
    $path = '/index.html' if $path eq '/';
    my $handler = $dispatch{$path};
    if (ref($handler) eq "CODE")
    {
        if ( $path =~ /-json$/ )
        {
#            print "HTTP/1.0 200 OK\r\n";
            if ( $cgi->param('POSTDATA') )
            {
                my $postdata = $cgi->param( 'POSTDATA' );
                my $obj = $json->decode( $postdata );
                foreach my $k ( keys %{ $obj } )
                {
                    $cgi->param( -name => $k, -value => $obj->{$k} );
                }
            }
    
            my $result;
            eval
            {
                $result = $handler->( $cgi );
            };
            if ( $@ ne '' )
            {
                print "HTTP/1.0 500 Perl Module Failure\r\n";
                $self->logger->error( "Error processing '$path': $@" );
                print   $cgi->header(
                                 -type => 'application/json',
#                                 -cookie => $cookie,
                            ),
                                 $json->encode( [ 0, 'Error executing JSON handler: ' . $@ ] );
            }
            else
            {
                print "HTTP/1.0 200 OK\r\n";
                $result = {} if ( !defined($result) );
                my $converted = $json->allow_blessed->convert_blessed->encode( $result );
                print   $cgi->header(
                                 -type => 'application/json',
#                                 -cookie => $cookie,
                                 );
                print
                                 $converted;
                $self->logger->trace( 
                    "Served '$path'" );
            }                                 
        }
    }
    elsif ( -r "$self->{base}/etc/disbatch/htdocs/$path" && !($path =~ /\.\./) )
    {
        print "HTTP/1.0 200 OK\r\n";
        
        my $type = 'text/html';
        $type = 'text/javascript' if $path =~ /\.js$/;
        $type = 'text/css' if $path =~ /\.css$/;
        $type = 'image/png' if $path =~ /\.png$/;
        $type = 'image/gif' if $path =~ /\.gif$/;
        
        print $cgi->header( -type => $type );
        open F, "<$self->{base}/etc/disbatch/htdocs/$path";
        
                while( <F> )
                {
                        print;
                }
    }
     
    else
      {   
        print "HTTP/1.0 404 Not found\r\n";
        print $cgi->header(
#                                                        -cookie => $cookie,
                                                ),
              $cgi->start_html('Not found'),
              $cgi->h1("Not found: $path"), 
              $cgi->end_html;
    }
    
}


sub worker_thread
{
    my $self = shift;
    $self->run;
}

=item start()

Starts a new thread for the web-server, initialises itself, and returns.

=back
=cut

sub start
{
    my $self = shift;

    my $pid = fork();
    if ( $pid == 0 )
    {
        $self->worker_thread;
    }
}

=head1 JSON API Calls

=over 1

=cut

=item /scheduler-json

Enumerate through queues, collecting statistics on items to-do, complete and in-progress. Also includes maxthreads & preemptive. Callable via eventbus.

=cut
    
sub scheduler_json
{
    my $cgi = shift;
    
    my $scheduler_report = $Synacor::Disbatch::Engine::EventBus->scheduler_report;
    return $scheduler_report;
}


=item /set-queue-attr-json

Sets a queue attribute.

Parameters:

    attr		Attribute name
    value		Attribute value

Valid attributes: maxthreads preemptive

=cut

sub set_queue_attr_json
{
    my $cgi = shift;

    my %ret;
    my @validattrs = qw( maxthreads preemptive );

    my $attr = $cgi->param( 'attr' );
    
    if ( !grep($attr, @validattrs) )
    {
        $ret{ 'success' } = 0;
        $ret{ 'error' } = 'Invalid attr';
        return \%ret;
    }
    
    my $value = $cgi->param( 'value' );
    if ( !defined($value) )
    {
        $ret{ 'success' } = 0;
        $ret{ 'error' } = 'You must supply a value';
        return \%ret;
    }

    my $queueid = $cgi->param( 'queueid' );
    if ( !$queueid )
    {
        $ret{ 'success' } = 0;
        $ret{ 'error' } = 'You must supply a queueid';
        return \%ret;
    }
    
    my ($r, $e) = @{ $Synacor::Disbatch::Engine::EventBus->set_queue_attr($queueid, $attr, $value) };
    $ret{ 'success' } = $r;
    $ret{ 'error' } = $e if defined($e); 
    return \%ret;
}



=item /list-users-json

Returns an array of users from a group, optionally with a Perl expression filter.

Parameters:

    group		Group name
    filter		Perl expression filter

Filter examples:

    1				All users
    $username =~ /^[Aa]/	Users beginning with a or A
    $user.password eq 'foo'	User password is foo

=cut

sub list_users_json
{
    my $cgi = shift;
    
    return $Synacor::Disbatch::Engine::EventBus->list_users( $cgi->param('group'), $cgi->param('filter') );
}


=item /start-queue-json

Instansiate & commence a new queue.

Parameters:

    type		Class of queue to create
    name		Name of new queue (unused)

=cut

sub start_queue_json
{
    my $cgi = shift;
    
    my $type = $cgi->param( 'type' );
    my $name = $cgi->param( 'name' );
    
    return $Synacor::Disbatch::Engine::EventBus->construct_queue( $type, $name );
}


=item /queue-create-items-json

Create & queue items under a queue from a JSON object.

Parameters:

    queueid		Task ID
    object		Javascript Object containing queues
    
=cut

sub queue_create_tasks_json
{
    my $cgi = shift;
    
    my $queueid = $cgi->param( 'queueid' );
    my $jsobj = $cgi->param( 'object' );
    my $obj = $json->decode( $jsobj );
    return $Synacor::Disbatch::Engine::EventBus->queue_create_tasks( $queueid, $obj );
}


=item /queue-create-tasks-from-users-json

Create new tasks and add them to a queue queue using the result of a user filter to populate & substitute parameter data.

Parameters:

    queueid		Task ID
    group		Group name
    filter		Perl expression filter
    columns		JSON object containing parameters to create tasks with

=cut

sub queue_create_tasks_from_query_json
{
    my $cgi = shift;
    
    my $queueid = $cgi->param( 'queueid' );
    my $collection = $cgi->param( 'collection' );
    my $filter = $cgi->param( 'filter' );
    my $parameters = $json->decode( $cgi->param('parameters') );

    if ( $cgi->param('jsonfilter') )
    {
        my $f;
        $f = $json->decode($cgi->param('jsonfilter') );
        $filter = $f;
    }
    
    return $Synacor::Disbatch::Engine::EventBus->queue_create_tasks_from_query( $queueid, $collection, $filter, $parameters );
}


=item /queue-prototypes-json

Returns a hash of the queues with each parameter defined.

=cut

sub queue_prototypes_json
{
    my $cgi = shift;
    
    return $Synacor::Disbatch::Engine::EventBus->queue_prototypes;
}


=item /reload-queues-json

Ask engine to reload the Perl queue classes.

=cut

sub reload_queues_json
{
    $Synacor::Disbatch::Engine::EventBus->reload_queues();
    return [1];
}


=item /search-tasks-json

Search through tasks.

=cut

sub search_tasks_json
{
    my $cgi = shift;
    
    my $tasks = $Synacor::Disbatch::Engine::EventBus->search_tasks( $cgi->param('queue'), $cgi->param('filter'), $cgi->param('json') || 0, $cgi->param('limit') || 0, $cgi->param('skip') || 0, $cgi->param('count') || 0, $cgi->param('terse') || 0 );

    return $tasks;
}


=item /delete-queue-json

Delete a Queue.

=cut

sub delete_queue_json
{
    my $cgi = shift;
    
    return { 'success' => $Synacor::Disbatch::Engine::EventBus->delete_queue($cgi->param('id')) };
}



sub logger
{
    my $self = shift or confess "No self!";
    my $classname = ref($self);
    $classname =~ s/^.*:://;
    
    my $logger = shift;
    if ( $logger )
    {
        my $l = "disbatch.httpd.$logger";
        $logger = $l;
    }
    else
    {
        $logger = "disbatch.httpd";
    }
    
    if ( !$self->{log4perl_initialised} )
    {    
        Log::Log4perl::init($self->{config}->{log4perl_conf});
        $self->{log4perl_initialised} = 1;
        $self->{loggers} = {};
    }
    
    return $self->{loggers}->{$logger} if ( $self->{loggers}->{$logger} );
    $self->{loggers}->{$logger} = Log::Log4perl->get_logger( $logger );
    return $self->{loggers}->{$logger};
}


1;
