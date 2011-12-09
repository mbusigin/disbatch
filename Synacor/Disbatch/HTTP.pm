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
use HTTP::Server::Simple::CGI;
use threads;
use threads::shared;
use Data::Dumper;
use JSON::XS; # -convert_blessed_universally;
use Text::CSV_XS;
use POSIX;
use Authen::Simple::LDAP;
use Authen::Simple::Passwd;
use Synacor::Migration::Plugins::Zimbra::Utils;

use base qw(HTTP::Server::Simple::CGI HTTP::Server::Simple::Authen);


my $json = undef;


my %dispatch =
(
    '/scheduler-json'				=> \&scheduler_json,
    '/reload-queues-json'			=> \&reload_queues_json,
    '/set-queue-attr-json'			=> \&set_queue_attr_json,
    '/list-user-groups-json'			=> \&list_user_groups_json,
    '/list-users-json'				=> \&list_users_json,
    '/get-user-json'				=> \&get_user_json,
    '/set-user-json'				=> \&set_user_json,
    '/add-users-json'				=> \&add_users_json,
    '/start-queue-json'				=> \&start_queue_json,
    '/delete-queue-json'			=> \&delete_queue_json,
    '/queue-create-tasks-json'			=> \&queue_create_tasks_json,
    '/queue-create-tasks-from-users-json'	=> \&queue_create_tasks_from_users_json,
    '/queue-prototypes-json'			=> \&queue_prototypes_json,
    '/search-tasks-json'			=> \&search_tasks_json,
    '/get-insight-password-json'		=> \&get_insight_password_json,
);


=item new()

Instantiate new web-server.

=cut

sub new
{
    my $class = shift;
    my $self = HTTP::Server::Simple->new( @_ );
    return bless $self, $class;
}

sub do_authenticate {
    my $self = shift;
    if (($ENV{HTTP_AUTHORIZATION} || '') =~ /^Basic (.*?)$/) {
        my($user, $pass) = split /:/, (MIME::Base64::decode($1) || ':');
        if ($self->authen_handler->authenticate($user, $pass)) {
            return $user;
        }
    }

    return;
}

sub authen_handler
{
    my $task = eval
    {
        package asksfak;
        use Data::Dumper;
        sub new
        {
            my $class = shift;
            my %h;
            bless \%h, $class;
            return \%h;
        }
        
        sub authenticate
        {
            my ( $self, $user, $pass ) = @_;
            
            return 1;
            return 0 if ( !$user or !$pass );

            warn $user;
            warn $pass;
            
            return 1;
        }
        
        __PACKAGE__;
    }->new;
    return $task;
}


=item handle_request()

This method overrides the HTTP::Server::Simple default, and is called when a request is made.

It maintains a JSON object, and makes JSON API calls (translating the
responses to JSON for output) if the request path ends in "-json".

If the request path does not end in "-json", it will attempt to grab a file
out of the htdocs/ directory.

=cut

sub handle_request
{
    my $self = shift;
    my $cgi  = shift;

#    my $user = $self->authenticate or return;
    
    $json = new JSON::XS if ( !$json );
    my $path = $cgi->path_info();
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
                warn "Error!  $@";
                print   $cgi->header(
                                 -type => 'application/json',
#                                 -cookie => $cookie,
                                 ),
                                 $json->encode( [ 0, 'Error executing JSON handler: ' . $@ ] );
            }
            else
            {
                print "HTTP/1.0 200 OK\r\n";
                warn "converting to json";
                $result = {} if ( !defined($result) );
                my $converted = $json->allow_blessed->convert_blessed->encode( $result );
                warn "converted (" . length($converted) . " bytes)\n";
                print   $cgi->header(
                                 -type => 'application/json',
#                                 -cookie => $cookie,
                                 );
                warn "printed header\n";
                print
                                 $converted;
                warn "printed json\n";
            }                                 
        }
    }
    elsif ( -r "htdocs/$path" && !($path =~ /\.\./) )
    {
        print "HTTP/1.0 200 OK\r\n";
        
        my $type = 'text/html';
        $type = 'text/javascript' if $path =~ /\.js$/;
        $type = 'text/css' if $path =~ /\.css$/;
        $type = 'image/png' if $path =~ /\.png$/;
        $type = 'image/gif' if $path =~ /\.gif$/;
        
        print $cgi->header( -type => $type );
        open F, "<htdocs/$path";
        
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
    
    threads->new( \&worker_thread, $self );
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
    if ( !$value )
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
    $ret{ 'error' } = $e
    if defined($e); warn Dumper( \%ret ); return \%ret;
}


=item /list-user-groups-json

Returns an array of user group names.

=cut

sub list_user_groups_json
{
    my $cgi = shift;
    return $Synacor::Disbatch::Engine::EventBus->list_user_groups;
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


=item /get-user-json

Return a user structure by name & group.

Parameters:

    group		Group name
    id			User ID
    
=cut

sub get_user_json
{
    my $cgi = shift;
    
    my $group = $cgi->param( 'group' );
    my $id = $cgi->param( 'id' );
    
    return $Synacor::Disbatch::Engine::EventBus->get_user( $group, $id );
}


=item /set-user-json

Set or overwrite attributes on a user.

Parameters:

    group		Group name
    id			User ID
    object		JSON object with associative array containing updates

=cut

sub set_user_json
{
    my $cgi = shift;
    
    my $group = $cgi->param( 'group' );
    my $id = $cgi->param( 'id' );
    my $jsobj = $cgi->param( 'object' );
    my $obj = $json->decode( $jsobj );
    
    warn "Group:  $group; id: $id:  obj: $obj\n";
    
    return $Synacor::Disbatch::Engine::EventBus->set_user( $group, $id, $obj );
}


=item /add-users-json

Add users to a group by either JSON object or CSV file.

Parameters:

    group		Group name
    
    users		JSON object with array of user objects
        OR
    users_csv		File upload with users in a CSV

=cut

sub add_users_json
{
    my $cgi = shift;
    
    my $group = $cgi->param( 'group' );
    my $usersjs = $cgi->param( 'users' );
    my $users;

    if ( $cgi->param('users_csv') )
    {
        warn "OK, users from CSV\n";
        my $csvtext = $cgi->param( 'users_csv' );
        my $fn = POSIX::tmpnam;
        open( F, ">$fn" ) or die "Couldn't open $fn\n";
        print F $csvtext;
        close( F );
        open( F, "<$fn" ) or die "Couldn't open $fn\n";
        my $csv = Text::CSV_XS->new({ sep_char => ",", eol => $/, binary => 1 }); 
        $csv->column_names( $csv->getline(*F) );
        my @users;
        while( my $row = $csv->getline_hr(*F) )
        {
            push @users, $row;   
            warn "Pushing $row->{username}\n";
#            warn Dumper( $row );
        }
        $users = \@users;
        warn "Users: " . scalar(@users) . "\n";
    }
    else
    {
        $users = $json->decode( $usersjs );
    }  
      
    warn "Users: " . scalar( @{$users} ) . "\n";
    return $Synacor::Disbatch::Engine::EventBus->add_users( $group, $users );
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
    
    warn Dumper( $cgi );
    
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
    warn "jsobj: $jsobj\n";
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

sub queue_create_tasks_from_users_json
{
    my $cgi = shift;
    
    my $queueid = $cgi->param( 'queueid' );
    my $group = $cgi->param( 'group' );
    my $filter = $cgi->param( 'filter' );
    my $columns = $json->decode( $cgi->param('columns') );

    if ( $cgi->param('jsonfilter') )
    {
        my $f;
        $f = shared_clone( $json->decode($filter) );
        $filter = $f;
    }
    
    return $Synacor::Disbatch::Engine::EventBus->queue_create_tasks_from_users( $queueid, $group, $filter, $columns );
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
    
    warn "Calling\n";
    my $tasks = $Synacor::Disbatch::Engine::EventBus->search_tasks( $cgi->param('queue'), $cgi->param('filter'), $cgi->param('json') || 0, $cgi->param('limit') || 0, $cgi->param('skip') || 0, $cgi->param('count') || 0, $cgi->param('terse') || 0 );
    warn "Called\n";

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


=item /get-insight-password-json

Get an Insight password.

=cut

sub get_insight_password_json
{
    my $cgi = shift;
    
    my $username = $cgi->param( 'username' );
    my $password = get_password( $username );
    
    my %ret;
    $ret{ 'password' } = $password;
    return \%ret;
}


1;
