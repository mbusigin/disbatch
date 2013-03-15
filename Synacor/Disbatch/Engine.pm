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
use Try::Tiny;
use Carp;
use Log::Log4perl;

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
    my %queue_constructors;

    my $self =
    {
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
    $self->{ 'eb' }->{ 'methods' }{ 'scheduler_report' } = \&scheduler_report;
    $self->{ 'eb' }->{ 'methods' }{ 'set_queue_attr' } = \&set_queue_attr;
    $self->{ 'eb' }->{ 'methods' }{ 'construct_queue' } = \&construct_queue;
    $self->{ 'eb' }->{ 'methods' }{ 'queue_create_tasks'} = \&queue_create_tasks;
    $self->{ 'eb' }->{ 'methods' }{ 'queue_create_tasks_from_query' } = \&queue_create_tasks_from_query;
    $self->{ 'eb' }->{ 'methods' }{ 'queue_prototypes' } = \&queue_prototypes;
    $self->{ 'eb' }->{ 'methods' }{ 'search_tasks' } = \&search_tasks;
    $self->{ 'eb' }->{ 'methods' }{ 'delete_queue' } = \&delete_queue;
    $self->{ 'eb' }->{ 'procedures' }{ 'report_task_done' } = \&report_task_done;
    $self->{ 'eb' }->{ 'procedures' }{ 'update_node_status' } = \&update_node_status;
    $self->{ 'eb' }->{ 'procedures' }{ 'reload_queues' } = \&reload_queues;
    $self->{ 'eb' }->{ 'procedures' }{ 'register_task_status_observer' } = \&register_task_status_observer;

    $config->{'tasks_collection'} = 'tasks' if !defined($config->{'tasks_collection'});
    $config->{'queues_collection'} = 'queues' if !defined($config->{'queues_collection'});

    Synacor::Disbatch::Backend::initialise( $config->{'mongohost'}, $config->{'mongodb'}, $config->{'mongouser'}, $config->{'mongopassword'}, $config->{'tasks_collection'}, $config->{'queues_collection'} );
    $Engine = $self;
    return $self;
}

=item logger()
 
 Returns a log4perl instance 
=cut

sub logger
{
    my $self = shift or confess "No self!";
    my $logger = shift;
    if ( $logger )
    {
        my $l = "disbatch.engine.$logger";
        $logger = $l;
    }
    else
    {
        $logger = "disbatch.engine";
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


=item add_queue()

Adds a queue to the Engine for execution.  This will essentially just
periodically and strategically call $queue->schedule().

=cut

sub add_queue
{
    my $self = shift;
    my $queue = shift;
    
    push @{ $self->{'queues'} }, $queue;
    $queue->{ 'id' } = $self->{_id};
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
                $self->logger->info( 'Completed a CTF' );
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

    $self->logger->trace( "Reporting done: queue #$queueid/$task" );

    if ( $self->{'task_observers'}->{$task} )
    {
        $self->logger->warn( "Found registered observer.  Enqueuing status." );
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
    
    
    $self->logger->warn( "Task #$queueid doesn't exist!" );
    
    return;
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

#        warn Dumper( $queue );
        $t{ 'id' } = $queue->{ 'id' }->to_string;
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


=item filter_collection()

Parameters:

  $collection	Collection
  $filter		Perl expression filter
  $type			Hash or array (default: hash)
  $key          Key attribute (Optional, requires $type to eq 'hash')

NOT an object-oriented method for Engine.

=cut

sub filter_collection
{
    my ( $collection, $filter, $type, $key ) = @_;
    $type ||= "hash";
            
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
                $Engine->logger->warn( "Filter eval failure: $@" );
                return {};
            }
        };
        if ( $@ )
        {
            $Engine->logger->warn( "Error processing filter: $@" );
            return {};
        }
    }
    
    if ( ref($hr) ne 'HASH' )
    {
        $Engine->logger->error( "Couldn't process filter hash because it's not a hashref" );
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

    my $query = Synacor::Disbatch::Backend::query_collection( $collection, $hr, {retry => 'synchronous'} );
    return $query
            if $type eq 'query';
    my @all = $query->all;
    return \@all
            if $type eq 'array';
    
    my %results;
    
    foreach my $document ( @all )
    {
        $results{ $document->{$key} } = $document;
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
    $obj{ 'name' } = $name;
    my $oid = Synacor::Disbatch::Backend::insert_collection( $self->{'config'}->{'queues_collection'}, \%obj, {retry => 'synchronous'} );    
    $queue->{ 'id' } = $queue->{ '_id' } = $oid;
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
    
    Synacor::Disbatch::Backend::delete_collection( $self->{'config'}->{'queues_collection'},  { '_id' => $id }, {retry => 'redolog'} );
    
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
        my $iobject = $queue->create_task( $task );
        next if !defined($iobject);
        $count ++;
        push @tids, $iobject->{ '_id' } if defined($returntids);
    }
    
    return [ 1, $count, @tids ] if defined($returntids);
    return [ 1, $count ];
}


=item queue_create_tasks_from_query()

Create new tasks and add them to a queue queue using the result of a user
filter to populate & substitute parameter data.

Parameters:

    $queueid            Task ID
    collection          Collection
    $filter             Perl expression filter
    $columns_arrayref	Array-ref of parameters

Callable via eventbus.

=cut

sub queue_create_tasks_from_query
{
    my ( $self, $queueid, $collection, $filter, $columns_arrayref ) = @_;
    
    try
    {
        my $ctf = Synacor::Disbatch::ChunkedTaskFactory->new( $self, $queueid, $collection, $filter, $columns_arrayref );
        push @{$self->{'chunkedtaskfactories'}}, $ctf;
        return [1, $ctf->{'count'}];
    }
    catch
    {
        return [-1, 0, 'Error creating chunked task factory from query: ' . $_ ];
    };
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

    my @queues = Synacor::Disbatch::Backend::query_collection( $self->{'config'}->{'queues_collection'}, {}, {retry => 'synchronous'} )->all;
    my %queues = map { $_->{'id'} => $_ } @{$self->{'queues'}};


    foreach my $row ( @queues )
    {
        next if $queues{$row->{'_id'}};
        next if $self->is_active_queue( $row->{'_id'} ) == 0;
        
        my $constructor = $self->{ 'queue_constructors' }->{ $row->{'constructor'} };
        if ( !$constructor )
        {
            $self->logger->warn( "Couldn't load constructor for $constructor" );
            next;
        }

        my $queue;
        
        eval        
        {
            $queue = &$constructor( $row->{'constructor'}, $self );
        };
        if ( $@ )
        {
            $self->logger->error( "Unable to construct queue $row->{name}: $@" );
            next;
        }
        
        $queue->{ 'id' } = $queue->{_id} = $row->{ '_id' };
#        $queue->{ 'name' } = $row->{ 'name' };
#        $queue->{ 'constructor' } = $row->{ 'constructor' };
        
        foreach my $attr (keys %{$row})
        {
            if ( $attr ne '_id' )
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
    
    my $query = Synacor::Disbatch::Backend::query_collection( $self->{'config'}->{'queues_collection'}, {}, {}, {retry => 'no'} );
    return if !$query;
    
    my @queues = $query->all;
    my %queues = map { $_->{'_id'} => $_ } @{$self->{'queues'}};
    
    foreach my $queue ( @queues )
    {
        my $queue2 = $queues{ $queue->{'_id'} };
        if ( !$queue2 )
        {
            $self->load_queues if $self->is_active_queue( $queue->{'_id'} ) == 1;
            next;
        }

        foreach my $key ( keys %{$queue} )
        {
            next if $key eq '_id';
            if ( $queue->{$key} ne $queue2->{$key} )
            {
                $self->logger->info( "Setting $queue->{_id} $key from " . $queue2->{$key} . ' to ' . $queue->{$key} );
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
            $self->logger->error( "No such constructor '$type'!" );
            next;
        }
        
        my $queue = &$constructor( $type, $self );
        
        if ( !$queue )
        {
            $self->logger->error( "Couldn't create queue '$type' from constructor!" );
            next;
        }
        
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
    
    my $queue = shift;
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
            $self->logger->error( "Error evaluating filter: $@" );
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
        $self->logger->error( "Filter not a hashref" );
            $hr = {};
#        return [];
    }
    
    $hr->{ 'queue' } = MongoDB::OID->new( value => $queue );
    $hr->{'_id'} = MongoDB::OID->new( value => $hr->{'id'} ) if ( $hr->{'id'} );
    delete $hr->{id};

    $hr->{status} = int($hr->{status}) if defined($hr->{status});
    
    my $cursor = Synacor::Disbatch::Backend::query_collection( $self->{config}->{'tasks_collection'}, $hr, $attrs, {retry => 'synchronous'} );
    return [ 1, $cursor->count() ] if $count;
    my @tasks = $cursor->all;
    
    foreach my $task (@tasks)
    {
        my $parameters = $task->{ 'parameters' };
        $task->{ 'parameters' } = $self->{'parameterformat_read'}( $parameters ) if $parameters;
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
    return \@tasks;
}


sub register_task_status_observer
{
    my $self = shift;
    my $tid = shift;
    my $queue = shift;

    my $task =  $Synacor::Disbatch::Engine::mongo->get_collection($self->{'config'}->{'tasks_collection'})->find_one( {_id => MongoDB::OID->new(value => $tid)} );
    if ( !$task )
    {
        die "Couldn't find task by $tid\n";
    }
    if ( $task->{'status'} == 1 )
    {
        $queue->enqueue( 1 );
    }
    else
    {
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
