package Synacor::Disbatch::Queue;

use strict;
use threads;
use Data::Dumper;
use JSON -convert_blessed_universally;

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
#        $tasks->update( {'node' => -1, 'status' => -2, 'tid' => $self->{'id'}}, { '$set' => {'node' => $node, 'status' => -1} } );
        Synacor::Disbatch::Backend::update_collection( 'tasks', {'node' => -1, 'status' => -2, 'tid' => $self->{'id'}}, { '$set' => {'node' => $node, 'status' => -1} } );
#        my $row = $tasks->find_one( {'node' => $node, 'status' => -1, 'tid' => $self->{'id'}} );
        my $row = Synacor::Disbatch::Backend::query_one( 'tasks', {'node' => $node, 'status' => -1, 'tid' => $self->{'id'}} );
        return if !$row;
        # $tasks->update( {'_id' => $row->{'_id'}}, { '$set' => {'status' => 0, 'mtime' => time() } } );
        Synacor::Disbatch::Backend::update_collection( 'tasks', {'_id' => $row->{'_id'}}, { '$set' => {'status' => 0, 'mtime' => time() } }, {retry => 'redolog'} );
        my $task = $self->load_task( $row );

        #push @{ $self->{'threads'} }, $self->{ 'threads_inuse' }{ $taskid };
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
    untie @_;
#    print "!! Synacor::Disbatch::Queue->create_task() stub.\n";
    my $task = $self->create_task_actual( @_ );
    $task->{ 'id' } = $self->{ 'engine' }->generate_id;
    
    
    my $frozen_params = $self->{ 'engine' }->{'parameterformat_write'}( \@_ );
    my %obj;
    $obj{ 'iid' } = $task->{ 'id' };
    $obj{ 'tid' } = $self->{ 'id' };
    $obj{ 'status' } = -2;
    $obj{ 'stdout' } = '';
    $obj{ 'stderr' } = '';
    $obj{ 'node' } = -1;
    $obj{ 'parameters' } = $frozen_params;
    $obj{ 'ctime' } = time();
    $obj{ 'mtime' } = time();

    Synacor::Disbatch::Backend::insert_collection( 'tasks', \%obj, {retry => 'redolog'} );
    
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
        if ( $self->{'tasks_doing'}->[$x]->{ 'id' } eq $taskid )
        {
            my $task = $self->{ 'tasks_doing' }->[ $x ];
            splice @{ $self->{'tasks_doing'} }, $x, 1;
            my $thr = $self->{threads_inuse}{$taskid};
            if ( !$thr )
            {
                warn "wtf - no thread for $self $taskid $status $stdout $stderr";
            }
            push @{ $self->{'threads'} }, $self->{ 'threads_inuse' }{ $taskid };
            delete $self->{ 'threads_inuse' }{ $taskid };
            
#    $collection->update({'x' => 3}, {'$inc' => {'count' => -1} }, {"upsert" => 1, "multiple" => 1});
#            warn "taskid: $taskid;  stdout: $stdout;  status: $status\n";
#            warn $Synacor::Disbatch::Engine::mongo->get_collection( 'tasks' )->update( {'iid' => $taskid}, {'$set' => { 'stdout' => $stdout, 'stderr' => $stderr, 'status' => $status }} );
            Synacor::Disbatch::Backend::update_collection( 'tasks', {'iid' => "$taskid"}, {'$set' => { 'stdout' => $stdout, 'stderr' => $stderr, 'status' => $status }}, {retry => 'redolog'} );
            
#            $update_tasks_sth ||= $Synacor::Disbatch::Engine::dbh->prepare( 'UPDATE tasks SET status = ?, stdout = ?, stderr = ? where iid = ?' );
#            $update_tasks_sth->execute( ($status, $stdout, $stderr, $taskid) );
#            $Synacor::Disbatch::Engine::dbh->commit;
            $self->schedule if $self->{ 'preemptive' };
#            print "Finished $taskid.\n";
            return;
        }
    }
    
    print "!! Synacor::Disbatch::Queue->report_task_done() called on invalid taskid #$taskid\n";
}


sub start_thread_pool
{
    my $self = shift;

    if ( $self->{'engine'}->is_active_queue($self->{'id'}) == 0 )
    {
        warn "No threads for $self->{id}";
        return 0;
    }
      
    my $threads = scalar( @{$self->{'threads'}} )
                + scalar( keys %{$self->{'threads_inuse'}} );
    my $nt = $self->{'maxthreads'} - $threads;
#    print "Have to create $nt new threads.\n";
    for ( my $x = 0; $x < $nt; $x ++ )
    {
        $self->{ 'lastthreadid' } ++;
        my $worker = Synacor::Disbatch::WorkerThread->new( $self->{'lastthreadid'} );
#        print "Starting worker #$self->{lastthreadid}\n";
#        $worker->thread_start;
        threads->yield();
        push @{$self->{'threads'}}, $worker;
        warn "pushed $worker";
    }
    
    return $nt;
}


sub get_free_thread
{
    my $self = shift;

    my $thread = pop @{ $self->{'threads'} };
    return $thread;
}


my $select_tasks_sth = undef;
my $select_parameters_sth = undef;
sub load_tasks
{
    my $self = shift;
    
    
    my @tasks = $Synacor::Disbatch::Engine::mongo->get_collection( 'tasks' )->query( {'tid' => $self->{'id'}} )->all;
    
    foreach my $row ( @tasks )
    {
        my @parameters;
        @parameters = $self->{'engine'}->{'parameterformat_read'}($row->{'parameters'})->[ 0 ] if $row->{'parameters'}; # @{ $Synacor::Disbatch::Engine::dbh->selectcol_arrayref('select parameter from task_parameters where task_id = ? order by id asc', undef, ($iid) ) };
#        warn Dumper( \@parameters );
        my $task = $self->create_task_actual( @parameters );

        $task->{ 'id' } = $row->{ 'iid' };
    }
}


sub load_task
{
    my $self = shift;
    my $row = shift;
    
    my @parameters;
    @parameters = $self->{'engine'}->{'parameterformat_read'}($row->{'parameters'})->[ 0 ] if $row->{'parameters'}; 
    my $task = $self->create_task_actual( @parameters );
    if ( !$task )
    {
        warn "Couldn't create task!  Parameters: " . Dumper(\@parameters) . "\n" . "row: " . Dumper($row) . "\n";
    }

    $task->{ 'id' } = $row->{ 'iid' };
    return( $task );
}


sub count_todo
{
    my $self = shift;
#    return $self->{ 'tasks' }->count( {'status' => -2, 'tid' => $self->{'id'}} );
    return Synacor::Disbatch::Backend::count( 'tasks', {'status' => -2, 'tid' => $self->{'id'}} );
}


sub count_total
{
    my $self = shift;
#    return $self->{ 'tasks' }->count( {'tid' => $self->{'id'}} );
    return Synacor::Disbatch::Backend::count( 'tasks', {'tid' => $self->{'id'}} );
}

1;
