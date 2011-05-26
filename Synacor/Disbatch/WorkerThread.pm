package Synacor::Disbatch::WorkerThread;

use strict;
use threads;
use threads::shared;
use Data::Dumper;
use Pinscher::Core::EventBus;

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

    my $self = 
    {
    };
    bless $self, $class;
    
    $self->{ 'eb' } = Pinscher::Core::EventBus->new( $self, 'worker#' . $id );
    $self->{ 'id' } = $id;
    $self->{ 'eb' }{ 'procedures' }{ 'start_task' } = \&start_task;

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
    my $self = shift;
    my $task = shift;

    if ( !$self->{id} )
    {
        print "What the hell!  start_task() called without self.\n";
        return 1;
    }
#     print $self->{ 'id' } . ': ' . ref($task) . "\n";
    $task->run();
    
    
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



1;
