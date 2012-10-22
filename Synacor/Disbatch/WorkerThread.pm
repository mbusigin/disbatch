package Synacor::Disbatch::WorkerThread;

use strict;
use Data::Dumper;
use Pinscher::Core::EventBus;
use Synacor::Disbatch::Engine;
use Try::Tiny;
use Carp;
use Synacor::Disbatch::Engine;
use MJMS::Connection;
use MJMS::Queue;
use MJMS::Message;


=head1 NAME

Synacor::Disbatch::WorkerThread - thread execution container

=head1 DESCRIPTION

A queue will spawn worker threads, and then saturate them with work as
available.

The thread management & work scheduling process is completely handled by the
framework, so you needn't know about this thread unless you're tinkering
with the inner workings of the engine.

=head1 NETHODS

=over 1

=cut


=item new()

Creates a new Synacor::Disbatch::WorkerThread.

Arguments:

  $id		The ID for the new worker thread
  
=cut

sub new
{
    my $class = shift;
    my $id = shift;
    my $queue = shift;

    my $self = 
    {
    };
    bless $self, $class;
    
    $self->{ 'eb' } = Pinscher::Core::EventBus->new( $self, 'worker#' . $id );
    $self->{ 'id' } = $id;
    $self->{ 'queue' } = $queue;
    $self->{ 'eb' }{ 'procedures' }{ 'start_task' } = \&start_task;
    $self->{ 'config' } = $Synacor::Disbatch::Engine::Engine->{config};
    $self->{ 'data' } = {};

    $self->thread_start;

    return $self;
}


=item start_task()

Begin work on a new Synacor::Disbatch::Task.

Arguments:

  $task		Task to work on

=cut

sub start_task
{
    my $self = shift or confess "No self!";
    my $task = shift or confess "No task!";

    if ( !$self->{id} )
    {
        confess "No 'id'!";
        return 1;
    }
#     print $self->{ 'id' } . ': ' . ref($task) . "\n";
    $task->{ 'workerthread' } = $self;
    
    try
    {
        $task->run( $self );
    }
    catch
    {
        $self->logger( "Thread has uncaught exception: $_" );
        $Synacor::Disbatch::Engine::EventBus->report_task_done( $task->{'queue_id'}, $task->{'_id'}, 2, 'Unable to complete', "Thread has uncaught exception: $_" );        
    };
    
    
    return 1;
}

sub startstuff
{
    my $self = shift;
    
    $self->{ 'eb' }->run;
}


=item thread_start()

Start thread.  This happens automatically with the default constructor.

=cut

sub thread_start
{
    my $self = shift;
    
    my $pid = fork();
    if ( $pid == 0 )
    {
        startstuff( $self );
    }
    
#    my $ret = threads->create( \&startstuff, $self );
    return;
}


sub logger
{
    my $self = shift or confess "No self!";
    my $classname = ref($self->{queue});
    $classname =~ s/^.*:://;
        
    my $logger = shift;
    if ( $logger )
    {
        my $l = "disbatch.plugins.$classname.$logger";
        $logger = $l;
    }
    else
    {
        $logger = "disbatch.engine.$classname";
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


sub mongo
{
    my $self = shift or confess "No self!";
    
    return $self->{mongo} if defined($self->{mongo});
    $self->{mongo} = Synacor::Disbatch::Backend::connect_mongo( $self->{ 'config' }->{'mongohost'}, $self->{ 'config' }->{'mongodb'} );
    return $self->{mongo};
}


sub set
{
    my $self = shift or confess "No self!";
    my $key = shift or confess "No key!";
    my $value = shift;
    $self->{ 'data' }->{ $key } = $value;
}


sub get
{
    my $self = shift or confess "No self!";
    my $key = shift or confess "No key!";
    return $self->{ 'data' }->{ $key };
}


sub unset
{
    my $self = shift or confess "No self!";
    my $key = shift or confess "No key!";
    delete $self->{ 'data' }->{ $key };
}

1;
