package Synacor::Disbatch::Queue;

use strict;
use threads;
use Data::Dumper;
use JSON -convert_blessed_universally;
use Carp;
use Try::Tiny;
use Synacor::Disbatch::Engine;


=head1 NAME

Synacor::Disbatch::Queue - the base class for a migration queue.  This
contains the housekeeping functions, and encapsulates
Synacor::Disbatch::Task objects which do the actual work.


=head1 METHODS

=over 1

=cut


=item new()

Creates new Synacor::Disbatch::Queue.

Arguments:

  $maxthreads		The maximum number of concurrent threads

=cut

sub new
{
    my $class = shift;

    my $maxthreads = shift;
    
    my @tasks_todo;
    my @tasks_doing;
    my @threads;
    my %threads_inuse;


    my $self = 
    {
        'tasks_doing'		=> \@tasks_doing,
        'maxthreads'		=> $maxthreads,
        'threads'		=> \@threads,
        'threads_inuse'		=> \%threads_inuse,
        'preemptive'		=> 1,
        'lastthreadid'		=> 0,
#        'tasks'			=> $Synacor::Disbatch::Backend::mongo->get_collection( 'tasks' ),
        'name'			=> '',
        'constructor'		=> '',
        'config'            => $Synacor::Disbatch::Engine::Engine->{config},
    };
    
    bless $self, $class;
    
    return $self;
}


=item schedule()

  This method decides when to spin up new threads, using a very simple
  algorithm which simply attempts to saturate **maxthreads** with work.

=cut

sub schedule
{
    my $self = shift;

    foreach my $t ( threads->list(threads::joinable) )
    {
        $t->join;
    }

#    my $tasks = $self->{ 'tasks' };
    my $node = $self->{ 'engine' }->{ 'config' }->{ 'node' };
    
#    print Dumper( $self->{tasks_doing} );
    
#    printf "%d / %d threads used.\n",
#            scalar(@{$self->{tasks_doing}}), $self->{maxthreads};
            
    my $free_threads = $self->{maxthreads} - scalar(@{$self->{tasks_doing}});
#     return 1 if $self->start_thread_pool > 0;
    
    for ( my $x = 0; $x < $free_threads; $x ++ )
    {
        Synacor::Disbatch::Backend::update_collection( 'tasks', {'node' => -1, 'status' => -2, 'queue' => $self->{'id'}}, 
                                                                { '$set' => {'node' => $node, 'status' => -1} } );
        my $row = Synacor::Disbatch::Backend::query_one( 'tasks', {'node' => $node, 'status' => -1, 'queue' => $self->{'id'}} );
        return if !$row;
        Synacor::Disbatch::Backend::update_collection( 'tasks', {'_id' => $row->{'_id'}}, 
                                                                { '$set' => {'status' => 0, 'mtime' => time() } }, 
                                                                {retry => 'redolog'} );
        my $task = $self->load_task( $row );

        my $thr = $self->get_free_thread();
#        print " ** Firing off $task->{id} to $thr->{id}\n";
        $self->{ 'threads_inuse' }->{ $task->{'id'} } = $thr;
        $thr->{'eb'}->start_task( $task );
        
#        print " ** Returned from $task\n\n";
        push @{ $self->{'tasks_doing'} }, $task;
        
    }
    

#    print "Scheduler done.\n\n";
    return 1;
}


=item create_task_actual()

Virtual/stub method which Queue implementors must override to provide to create
the new queue.  View Synacor::Disbatch::Queue::IMAP2IMAP as an example.

=cut


=item create_task()

Create an task using the create_task_actual() virtual/stub method, and save
it to the database.

=cut


sub create_task
{
    my $self = shift;
    my $parameters = shift;
    
    $self->logger->trace( "Synacor::Disbatch::Queue->create_task()" );
    my $task = $self->create_task_actual( $parameters );
      
    my $frozen_params = $self->{ 'engine' }->{'parameterformat_write'}( $parameters );
    my %obj;
    $obj{ 'queue' } = $self->{ 'id' };
    $obj{ 'status' } = -2;
    $obj{ 'stdout' } = '';
    $obj{ 'stderr' } = '';
    $obj{ 'node' } = -1;
    $obj{ 'parameters' } = $frozen_params;
    $obj{ 'ctime' } = time();
    $obj{ 'mtime' } = time();

    my $id = Synacor::Disbatch::Backend::insert_collection( 'tasks', \%obj, {retry => 'synchronous'} );
    $obj{ '_id' } = $obj{'id'} = $id;

    
    return $task;
}


=item parameters_definitions()

Reports back an arrayref containing hashrefs of task parameter definitions.

    [
        { name => 'foo', type => 'int', default => 1, description => 'unnecessary' },
    ]

=cut

sub parameters_definitions
{
    my $self = shift;
    return $self->parameters_definitions;
}


=item queue_parameters()

Reports back an arrayref containing hashrefs of queue parameter definitions.

    [
        { name => 'foo', type => 'int', default => 1, description => 'unnecessary' },
    ]


=cut

sub queue_parameters
{
    my $self = shift;
    return $self->queue_parameters;
}


=item report_task_done()

Reports that an task for this queue is complete.  This is useful information
for the scheduler.

Parameters:

  $taskid		completed task ID	

=cut

my $update_tasks_sth = undef;
sub report_task_done
{
    my $self = shift;
    my $taskid = shift;
    my $status = shift;
    my $stdout = shift;
    my $stderr = shift;
    
    for ( my $x = 0; $x < scalar(@{$self->{tasks_doing}}); $x ++ )
    {
        if ( $self->{'tasks_doing'}->[$x]->{ '_id' }->to_string eq $taskid )
        {
            my $task = $self->{ 'tasks_doing' }->[ $x ];
            splice @{ $self->{'tasks_doing'} }, $x, 1;
            my $thr = $self->{threads_inuse}{$taskid};
            if ( !$thr )
            {
                $self->logger->error( "wtf - no thread for $self $taskid $status $stdout $stderr" );
            }
            push @{ $self->{'threads'} }, $self->{ 'threads_inuse' }{ $taskid };
            delete $self->{ 'threads_inuse' }{ $taskid };
            
            $self->logger->info( "taskid: $taskid;  stderr: $stderr;  status: $status" );
            Synacor::Disbatch::Backend::update_collection( 'tasks', {_id => $taskid}, {'$set' => { 'stdout' => $stdout, 'stderr' => $stderr, 'status' => $status }}, {retry => 'redolog'} );
            
            $self->schedule if $self->{ 'preemptive' };
            return;
        }
    }
    
    $self->logger->error( "!! Synacor::Disbatch::Queue->report_task_done() called on invalid taskid #$taskid" );
}


sub start_thread_pool
{
    my $self = shift;

    if ( $self->{'engine'}->is_active_queue($self->{'id'}) == 0 )
    {
        $self->logger->error( "No threads for $self->{id}" );
        return 0;
    }
      
    my $threads = scalar( @{$self->{'threads'}} )
                + scalar( keys %{$self->{'threads_inuse'}} );
    my $nt = $self->{'maxthreads'} - $threads;
#    print "Have to create $nt new threads.\n";
    for ( my $x = 0; $x < $nt; $x ++ )
    {
        $self->{ 'lastthreadid' } ++;
        my $worker = Synacor::Disbatch::WorkerThread->new( $self->{'lastthreadid'}, $self );
#        print "Starting worker #$self->{lastthreadid}\n";
#        $worker->thread_start;
        threads->yield();
        push @{$self->{'threads'}}, $worker;
        $self->logger->trace( "pushed $worker" );
    }
    
    return $nt;
}


sub get_free_thread
{
    my $self = shift;

    my $thread = pop @{ $self->{'threads'} };
    return $thread;
}


sub load_tasks
{
    my $self = shift;
    
    
    my @tasks = $Synacor::Disbatch::Engine::mongo->get_collection( 'tasks' )->query( {'queue' => $self->{'id'}} )->all;
    
    foreach my $row ( @tasks )
    {
        my $parameters;
        $parameters = $self->{'engine'}->{'parameterformat_read'}($row->{'parameters'}) if $row->{'parameters'}; # @{ $Synacor::Disbatch::Engine::dbh->selectcol_arrayref('select parameter from task_parameters where task_id = ? order by id asc', undef, ($iid) ) };
#        warn Dumper( \@parameters );
        my $task = $self->create_task_actual( $parameters );
    }
}


sub load_task
{
    my $self = shift;
    my $row = shift;
        
    my $parameters = $self->{'engine'}->{'parameterformat_read'}($row->{'parameters'}) if $row->{'parameters'}; 
    my $task = $self->create_task_actual( $parameters );
    if ( !$task )
    {
        $self->logger->error( "Couldn't create task!  Parameters: " . Dumper($parameters) . "\n" . "row: " . Dumper($row) );
    }

    $task->{ 'id' } = $task->{ '_id' } = $row ->{'_id'};
    return( $task );
}


sub count_todo
{
    my $self = shift;
    return Synacor::Disbatch::Backend::count( 'tasks', {'status' => -2, 'queue' => $self->{'id'}} );
}


sub count_total
{
    my $self = shift;
    return Synacor::Disbatch::Backend::count( 'tasks', {'queue' => $self->{'id'}} );
}


sub logger
{
    my $self = shift or confess "No self!";
    my $classname = ref($self);
    $classname =~ s/^.*:://;

    my $logger = shift;
    if ( $logger )
    {
        my $l = "disbatch.plugins.$classname.$logger";
        $logger = $l;
    }
    else
    {
        $logger = "disbatch.plugins.$classname";
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
