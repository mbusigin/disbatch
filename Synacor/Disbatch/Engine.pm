package Synacor::Disbatch::Engine;

use strict;
use Pinscher::Core::EventBus;
use Synacor::Disbatch::WorkerThread;
use Synacor::Disbatch::ChunkedTaskFactory;
use Synacor::Disbatch::Backend;
use JSON -convert_blessed_universally;
use MongoDB;
use DateTime;
use Storable qw(thaw nfreeze);
use Data::Dumper;
$Storable::interwork_56_64bit = 1;


=head1 NAME

Synacor::Engine - the core execution engine.  

=head1 DESCRIPTION

This module runs the main event loop, brokers threads, and generally decides
when to do something.

The execution engine is also responsible for maintaining the physical state
of all of its queues (and their tasks).

=head1 SYNOPSIS

  use Synacor::Engine;
  my $engine = Synacor::Engine->new;
  $engine->start;

=head1 METHODS

=over 4

=cut


=item new()

Creates a new instance of the Synacor::Engine.  You really should only use one of these at one time.

Parameters:

    $users		hashref to users

=cut

our $EventBus;
our $Engine;

our $json;


sub new
{
    my $class = shift;
    my $config = shift;

    my @queues;
    my %groups;
    my %queue_constructors;

    my $self =
    {
        'groups'		=> \%groups,
        'queues'		=> \@queues,
        'queue_constructors'	=> \%queue_constructors,
        'config'		=> $config,
        'reloadqueues'		=> 0,
        'chunkedtaskfactories'	=> [],
        'task_observers'	=> {},
    };
    
    
    bless $self, $class;

    # Configure event bus
    $EventBus = $self->{ 'eb' } = Pinscher::Core::EventBus->new( $self, 'Synacor::Engine' );
    $self->{ 'eb' }->{ 'methods' }{ 'awaken' } = \&awaken;
    $self->{ 'eb' }->{ 'methods' }{ 'generate_id' } = \&generate_id;
    $self->{ 'eb' }->{ 'methods' }{ 'scheduler_report' } = \&scheduler_report;
    $self->{ 'eb' }->{ 'methods' }{ 'set_queue_attr' } = \&set_queue_attr;
    $self->{ 'eb' }->{ 'methods' }{ 'construct_queue' } = \&construct_queue;
    $self->{ 'eb' }->{ 'methods' }{ 'queue_create_tasks'} = \&queue_create_tasks;
    $self->{ 'eb' }->{ 'methods' }{ 'queue_create_tasks_from_users' } = \&queue_create_tasks_from_users;
    $self->{ 'eb' }->{ 'methods' }{ 'queue_prototypes' } = \&queue_prototypes;
    $self->{ 'eb' }->{ 'methods' }{ 'search_tasks' } = \&search_tasks;
    $self->{ 'eb' }->{ 'methods' }{ 'delete_queue' } = \&delete_queue;
    $self->{ 'eb' }->{ 'procedures' }{ 'report_task_done' } = \&report_task_done;
    $self->{ 'eb' }->{ 'procedures' }{ 'update_node_status' } = \&update_node_status;
    $self->{ 'eb' }->{ 'procedures' }{ 'reload_queues' } = \&reload_queues;
    $self->{ 'eb' }->{ 'procedures' }{ 'register_task_status_observer' } = \&register_task_status_observer;

    Synacor::Disbatch::Backend::initialise( $config->{'mongohost'}, $config->{'mongodb'} );
    return $self;
}

=item add_queue()

Adds a queue to the Engine for execution.  This will essentially just
periodically and strategically call $queue->schedule().

=cut

sub add_queue
{
    my $self = shift;
    my $queue = shift;
    
    push @{ $self->{'queues'} }, $queue;
    $queue->{ 'id' } = $self->generate_id;
}


=item start()

Blocking function call which begins the event bus loop.  This will cause the
Synacor::Engine object to listen and react to events.

=cut

sub start
{
    my $self = shift;
    $self->{'eb'}->run;
}


=item awaken()

Pause from blocking event loop to fire off all queue schedulers.

=cut

sub awaken
{
    my $self = shift;
    
    foreach my $queue (@{ $self->{'queues'} })
    {
        $queue->schedule;
    }


    my $deletecount = 0;
    return if scalar( @{$self->{'chunkedtaskfactories'}} ) == 0;
    my $slice = $self->{'ctfquantum'} / scalar( @{$self->{'chunkedtaskfactories'}} );
    foreach my $ctf (@{ $self->{'chunkedtaskfactories'} })
    {
        $ctf->slice( $slice ) if $ctf->{'done'} < $ctf->{'count'};
        $deletecount ++ if $ctf->{'done'} == $ctf->{'count'};
    }


    for ( my $x = 0; $x < $deletecount; $x ++ )
    {
        my $index = 0;
        foreach my $ctf (@{ $self->{'chunkedtaskfactories'} })
        {
            if ( $ctf->{'done'} == $ctf->{'count'} )
            {
                splice @{ $self->{'chunkedtaskfactories'} }, $index, 1;
#                warn "Deleted a CTF";
                goto done;
            }
            
            $index ++;
        }
        done:
    }
    
    Synacor::Disbatch::Backend::process_redolog();
    
    return;
}


=item report_item_done()

Report that an item is complete.  Generally called from an Item's run()
function via the eventbus, this records that an item is complete so the
scheduler can start a new queued item.

=cut


sub report_task_done
{
    my $self = shift;
    my ( $queueid, $task, $status, $stdout, $stderr ) = @_;

    warn "Reporting done:  queue #$queueid/$task\n";

    if ( $self->{'task_observers'}->{$task} )
    {
        warn "There IS an observer.  Enqueuing status.";
        $self->{'task_observers'}->{$task}->enqueue( $status );
        delete $self->{ 'task_observers' }->{ $task };
    }
    
    foreach my $queue (@{ $self->{'queues'} })
    {
        if ( $queue->{'id'} eq $queueid )
        {
            $queue->report_task_done( $task, $status, $stdout, $stderr );
            return;
        }
    }
    
    
    print "!! Task #$queueid doesn't exist!\n";
    
    return;
}


=item generate_id()

Generate & return persistent UUID.  Callable via eventbus.

=cut

sub generate_id
{
    my $self = shift;

    my $ret = Synacor::Disbatch::Backend::generate_mongo_id( $self );
    return $ret;
}


=item scheduler_report()

Enumerate through queues, collecting statistics on tasks to-do, complete and
in-progress.  Also includes maxthreads & preemptive.  Callable via eventbus.

=cut

sub scheduler_report
{
    my $self = shift;
    
    my @rpt;
    
    foreach my $queue ( @{$self->{'queues'}} )
    {
        my %t;
        
        $t{ 'id' } = $queue->{ 'id' };    
        $t{ 'tasks_todo' } = $queue->count_todo;
        $t{ 'tasks_done' } = $queue->count_total - scalar( @{$queue->{'tasks_doing'}} ) - $t{ 'tasks_todo' };
        $t{ 'tasks_doing' } = scalar( @{$queue->{'tasks_doing'}} );
        $t{ 'maxthreads' } =  $queue->{ 'maxthreads' };
        $t{ 'preemptive' } = $queue->{ 'preemptive' };
        $t{ 'name' } = $queue->{ 'name' };
        $t{ 'constructor' } = $queue->{ 'constructor' };
        
        $t{ 'tasks_backfill' } = 0;
        foreach my $ctf ( @{$self->{'chunkedtaskfactories'}} )
        {
            if ( $ctf->{'queue'} == $queue )
            {
                $t{ 'tasks_backfill' } += $ctf->{ 'count' } - $ctf->{ 'done' };
            }
        }
        
        push @rpt, \%t;
#        $rpt{ $queue->{'id'} } = \%t;
    }
    
    return \@rpt;
}


=item set_queue_attr()

Set queue attribute.  Callable via eventbus.

=cut

sub set_queue_attr
{
    my ( $self, $queueid, $attr, $value ) = @_;
    
    my %queues = map { $_->{'id'} => $_ } @{$self->{'queues'}};
    return [0, 'Invalid queue ID'] if ( !exists($queues{$queueid}) );
    
    my $queue = $queues{ $queueid };
    $queue->{ $attr } = $value;
    Synacor::Disbatch::Backend::update_queue( $queueid, $attr, $value );
    
    return( [1, undef] );
}


=item filter_users()

Parameters:

  $users		User group
  $filter		Perl expression filter
  $type			Hash or array (default: hash)

NOT an object-oriented method for Engine.

=cut

sub filter_users
{
    my ( $users, $filter, $type ) = @_;
    $type ||= "hash";
    warn "filter_users(): $type";
            
#     return $users if !$filter or $filter eq '';
    my $hr = {};
    if ( ref($filter) eq 'HASH' )
    {
        # de-share it
        foreach my $k ( keys %{$filter} )
        {
            $hr->{ $k } = $filter->{ $k };
        }
    }
    else
    {
        eval
        {
            $hr = eval $filter;
            if ( $@ )
            {
                warn 'filter_users($users, $filter) = ' . $@;
                return {};
            }
        };
        if ( $@ )
        {
            warn 'filter_users($users, $filter) = ' . $@;
            return {};
        }
    }
    
    if ( ref($hr) ne 'HASH' )
    {
        warn "Not a hashref!: '$filter'\n" . ref($hr) . "\n" ;
        return {};
    }


    foreach my $k ( keys %{$hr} )
    {
        if ( $hr->{$k} =~ /^qr\/(.*)\/$/ )
        {
            my $re = $1;
            $hr->{ $k } = qr/$re/;
        }
    }

    my $query = Synacor::Disbatch::Backend::query_collection( 'users', $hr, {retry => 'synchronous'} );
    return $query
            if $type eq 'query';
    my @all = $query->all;
    return \@all
            if $type eq 'array';
    
    my %results;
    
    foreach my $user ( @all )
    {
        $results{ $user->{username} } = $user;
    }
    
    return \%results;
}


=item register_queue_constructor()

Registers a queue constructor with the engine.  Required for on-demand creation.

=cut

sub register_queue_constructor
{
    my ( $self, $name, $constructor ) = @_;
    
    $self->{ 'queue_constructors' }->{ $name } = $constructor;
    return;
}


=item construct_queue()

Using a previously register constructor, instantiate a new queue object.

Parameters:

    $type	String name of class
    $name	Name of new queue (currently ignored)

Callable via eventbus.

=cut

sub construct_queue
{
    my ( $self, $type, $name ) = @_;
    
    my $constructor = $self->{ 'queue_constructors' }->{ $type };
    return [ 0, 'Task constructor not found' ] if !$constructor;
    my $queue = &$constructor( $type, $self );
    $queue->{ 'name' } = $name;
    $queue->{ 'constructor' } = $type;
    
    $self->add_queue( $queue );
    
    my %obj;
    $obj{ 'constructor' } = $type;
    $obj{ 'tid' } = $queue->{ 'id' };
    $obj{ 'name' } = $name;
    Synacor::Disbatch::Backend::insert_collection( 'queues', \%obj, {retry => 'synchronous'} );
    return [ 1, $queue->{'id'} ];
}


=item delete_queue()

Delete a queue from engine & database.

Parameters:

    $id		Queue ID

=cut

sub delete_queue
{
    my ( $self, $id ) = @_;
    
    Synacor::Disbatch::Backend::delete_collection( 'queues',  { 'tid' => $id }, {retry => 'redolog'} );
    
    my $index = 0;
    foreach my $q ( @{ $self->{'queues'} } )
    {
        if ( $q->{'id'} eq $id )
        {
            splice @{ $self->{'queues'} }, $index, 1;
            return 1;
        }
        
        $index ++;
    }
    
    return 0;
}


=item get_queue_by_id()

Returns a queue structure by ID.

Parameters:

    $queueid		Task ID

Callable via eventbus.

=cut

sub get_queue_by_id
{
    my ( $self, $queueid ) = @_;
    
    foreach my $queue ( @{$self->{'queues'}} )
    {
        if ( $queue->{ 'id' } eq $queueid )
        {
            return( $queue );
        }
    }
    
    return undef;
}


=item queue_create_tasks()

Create new tasks and add them to a queue queue.

Parameters:

    $queueid		Task ID
    $tasks_arrayref	Array-ref to arrays of parameters
  
Callable via eventbus.

=cut

sub queue_create_tasks
{
    my ( $self, $queueid, $tasks_arrayref, $returntids ) = @_;
    untie $tasks_arrayref;
    
    my $queue = $self->get_queue_by_id( $queueid );
    return [ 0, 'Task not found' ] if !$queue;

    my @tids;

    my $count = 0;
    foreach my $task ( @{$tasks_arrayref} )
    {
        $count ++;
        my @params;
        foreach my $col ( @{$task} )
        {
            push @params, $col;
        }
        my $iobject = $queue->create_task( \@params );
        push @tids, $iobject->{ 'id' } if defined($returntids);
#        push @{$queue->{'tasks_todo'}}, $iobject;
    }
    
    return [ 1, $count, @tids ] if defined($returntids);
    return [ 1, $count ];
}


=item queue_create_tasks_from_users()

Create new tasks and add them to a queue queue using the result of a user
filter to populate & substitute parameter data.

Parameters:

    $queueid		Task ID
    $group		User group
    $filter		Perl expression filter
    $columns_arrayref	Array-ref of parameters

Callable via eventbus.

=cut

sub queue_create_tasks_from_users
{
    my ( $self, $queueid, $group, $filter, $columns_arrayref ) = @_;

    my $ctf = Synacor::Disbatch::ChunkedTaskFactory->new( $self, $queueid, $group, $filter, $columns_arrayref );
    push @{$self->{'chunkedtaskfactories'}}, $ctf;
    return [1, $ctf->{'count'}];

    my $queue = $self->get_queue_by_id( $queueid );
    return [ 0, 'Task not found' ] if !$queue;
    
    my $users = $self->{ 'groups' }->{ $group };
    return [ 0, 'No such group' ] if ( !$users );
    
    warn "Filtering users '$filter'...";
    $users = filter_users( $users, $filter, 'array' );
    warn "running through each user...";
    my $count = 0;
    foreach my $user ( @{$users} )
    {
        if ( ($count % 1000) == 0 )
        {
            warn "done $count";
        }
        $count ++;
        my $username = $user->{ 'username' };
        my @params;

        foreach my $col (@{ $columns_arrayref })
        {
            if ( $col =~ /^(user\.[a-zA-Z][a-zA-Z0-9_]*)$/ )
            {
                my $var = $1;
                my $key = $var;
                $key =~ s/user\.//;
                my $val = $user->{$key};
                push @params, $val;
            }
            elsif ( $col =~ /(user\.[a-zA-Z][a-zA-Z0-9_]*)/ )
            {
                my $var = $1;
                my $key = $var;
                $key =~ s/user\.//;
                my $val = $user->{$key};
                my $subs = $col;
                $subs =~ s/$var/$val/;
                push @params, $subs;
            }
            else
            {
                push @params, $col;
            }

        }
        my $iobject = $queue->create_task( \@params );
#        push @{$queue->{'tasks_todo'}}, $iobject;
        
#        my $tasks = $user->{ 'tasks' };
#        my @tasks;
#        if ( !$tasks )
#        {
#            push @tasks, $iobject->{ 'id' };
#            $user->{ 'tasks' } = \@tasks;
#        }
#          else
#        {
#            push @{ $user->{'tasks'} }, $iobject->{ 'id' };
#        }
#       $user->{ '_dirty' } = 1;
    }

#    $self->{ 'groups' }->{ $group }->save( 1 );

    return [ 1, $count ];
}


=item is_filtered_queue()

Determine whether queue is filtered in by the INI file

=cut

sub is_active_queue
{
    my $self = shift;
    my $q = shift;

    return 1 if !$self->{'activequeues'} and !$self->{'ignorequeues'};
    
    if ( $self->{'activequeues'} )
    {
        foreach my $f (@{$self->{'activequeues'}})
        {
            return 1 if $f eq $q;
        }
        return 0;
    }
    
    if ( $self->{'ignorequeues'} )
    {
        foreach my $f (@{$self->{'ignorequeues'}})
        {
            return 0 if $f eq $q;
        }
        return 1;
    }
}


=item load_queues()

Load & initialise queues from database.  This will also load all of the tasks
associated with those queues.

=cut

sub load_queues
{
    my $self = shift;

    warn "Loading queues...\n";
    my @queues = Synacor::Disbatch::Backend::query_collection( 'queues', {}, {retry => 'synchronous'} )->all;
    my %queues = map { $_->{'id'} => $_ } @{$self->{'queues'}};


    foreach my $row ( @queues )
    {
        next if $queues{$row->{'tid'}};
        next if $self->is_active_queue( $row->{'tid'} ) == 0;
        
        my $constructor = $self->{ 'queue_constructors' }->{ $row->{'constructor'} };
        if ( !$constructor )
        {
            warn "Couldn't load constructor for $constructor !!!";
            next;
        }

        my $queue;
        
        eval        
        {
            $queue = &$constructor( $row->{'constructor'}, $self );
        };
        if ( $@ )
        {
            warn "Unable to construct queue $row->{name}: $@";
            next;
        }
        
        $queue->{ 'id' } = $row->{ 'tid' };
#        $queue->{ 'name' } = $row->{ 'name' };
#        $queue->{ 'constructor' } = $row->{ 'constructor' };
        
        foreach my $attr (keys %{$row})
        {
            if ( $attr ne 'tid' )
            {
                $queue->{ $attr } = $row->{ $attr };
            }
        }
        
        push @{ $self->{'queues'} }, $queue;
    }
}


=item update_node_status()

Updates node status to MongoDB.

=cut

sub update_node_status()
{
    my $self = shift;

    my $status = Synacor::Disbatch::Backend::query_one( 'nodes', { 'node' => $self->{'config'}->{'node'} } );
    $status->{ 'node' } = $self->{ 'config' }->{ 'node' };
    $status->{ 'queues' } = $self->scheduler_report;
    $status->{ 'timestamp' } = DateTime->now;
    
    
    Synacor::Disbatch::Backend::update_collection( 'nodes', { 'node' => $self->{'config'}->{'node'} }, $status, { 'upsert' => 1 } );
    $self->reflect_queue_changes(); 
}

=item reflect_queue_changes()

Reflect changes made to queue attributes, ostensibly made initially on another node.

=cut

sub reflect_queue_changes
{
    my $self = shift;
    
    my $query = Synacor::Disbatch::Backend::query_collection( 'queues', {}, {}, {retry => 'no'} );
    return if !$query;
    
    my @queues = $query->all;
    my %queues = map { $_->{'id'} => $_ } @{$self->{'queues'}};
    
    foreach my $queue ( @queues )
    {
        my $queue2 = $queues{ $queue->{'tid'} };
        if ( !$queue2 )
        {
            $self->load_queues if $self->is_active_queue( $queue->{'tid'} ) == 1;
            next;
        }

        foreach my $key ( keys %{$queue} )
        {
            next if $key eq '_id' or $key eq 'tid';
            if ( $queue->{$key} ne $queue2->{$key} )
            {
                warn "Setting $queue->{tid} $key from $queue2->{maxthreads} to $queue->{maxthreads}";
                $queue2->{$key} = $queue->{$key};
            }
        }
    }
}


=item queue_prototypes()

Returns a hashref of queues, and the arguments they take to create new tasks;

=cut

sub queue_prototypes
{
    my $self = shift;
    
    my %r;
    foreach my $type ( keys %{ $self->{'queue_constructors'} } )
    {
        my $constructor = $self->{ 'queue_constructors' }->{ $type };
        if ( !$constructor )
        {
            warn "No such constructor '$type'!";
            next;
        }
        
        my $queue = &$constructor( $type, $self );
        
        if ( !$queue )
        {
            warn "Couldn't create queue '$type' from constructor!";
            next;
        }
        
        warn $type;
        $r{ $type } = $queue->parameters_definitions;
        $r{ 'settings' } = $queue->queue_definitions;
    }
    
    return \%r;
}


=item reload_queues()

Tells engine to reload queues on next iteration of the engine main loop

=cut

sub reload_queues
{
    my $self = shift;

    $self->{ 'reloadqueues' } = 1;
    return 1;
}


=item search_tasks()

Search through tasks.

=cut

sub search_tasks
{
    my $self = shift;
    
    my $tid = shift;
    my $filter = shift;
    my $isjson = shift;
    my $limit = shift;
    my $skip = shift;
    my $count = shift;
    my $terse = shift;
    
    
    my $attrs = {};
    $attrs->{ 'limit' } = $limit if $limit;
    $attrs->{ 'skip' } = $skip if $skip;
    
    my $hr;
    
    if ( !$isjson )
    {
        $hr = eval $filter;
        if ( $@ )
        {
            warn 'search_tasks($users, $filter) = ' . $@;
            return [];
        }  
    }
    else
    {
        $json = new JSON if ( !$json );
        $hr = $json->decode( $filter );
        
        foreach my $k ( keys %{$hr} )
        {
            if ( $hr->{$k} =~ /^qr\/(.*)\/$/ )
            {
                my $re = $1;
                $hr->{ $k } = qr/$re/;
            }
        }
    }
    
    if ( ref($hr) ne 'HASH' )
    {
        warn "Not a hashref!: '$filter'\n";
            $hr = {};
#        return [];
    }
    
    $hr->{ 'tid' } = $tid;
    
    warn "get_collection()";
    my $cursor = Synacor::Disbatch::Backend::query_collection( 'tasks', $hr, $attrs, {retry => 'synchronous'} );
    warn "got it";
    return [ 1, $cursor->count() ] if $count;

    warn "cursor->all";
    my @tasks = $cursor->all;
    warn "foreach";
    
    foreach my $task (@tasks)
    {
        my $parameters = $task->{ 'parameters' };
        $task->{ 'parameters' } = $self->{'parameterformat_read'}( $parameters )->[0] if $parameters;
        if ( $terse )
        {
            $task->{ 'stdout' } = '';
            $task->{ 'stderr' } = '';
        }
        
        if ( $task->{mtime} )
        {
            my $dt = DateTime->from_epoch( epoch => $task->{mtime} );
            $task->{mtime_str} = $dt->ymd . ' ' . $dt->hms;
        }
        if ( $task->{ctime} )
        {
            my $dt = DateTime->from_epoch( epoch => $task->{ctime} );
            $task->{ctime_str} = $dt->ymd . ' ' . $dt->hms;
        }
    }
    warn "returning";
    return \@tasks;
}


sub register_task_status_observer
{
    my $self = shift;
    my $tid = shift;
    my $queue = shift;

    my $task =  $Synacor::Disbatch::Engine::mongo->get_collection('tasks')->find_one( {'iid' => $tid} );
    if ( !$task )
    {
        die "Couldn't find task by $tid\n";
    }
    if ( $task->{'status'} == 1 )
    {
        warn "Setting task status to 1 right away";
        $queue->enqueue( 1 );
    }
    else
    {
        warn "Setting tid $tid observer";
        $self->{ 'task_observers' }->{ $tid } = $queue;
    }
}


sub storable_write
{
    my $param = shift;
    return nfreeze( $param );
}


sub storable_read
{
    my $param = shift;
    return thaw( $param );
}

sub json_write
{
    my $param = shift;
    return $param;
    $json = new JSON if ( !$json );
    return $json->encode( $param );
}


sub json_read
{
    my $param = shift;
    return $param;
    $json = new JSON if ( !$json );
    return $json->decode( $param );
}


1;
