package Synacor::Disbatch::Task;

use strict;
use Carp;
use Try::Tiny;


=head1 NAME

Synacor::Disbatch::Task - a single discrete task.  This is a base
class that is inherited, with run() overridden to do useful things like run
imapsync.

=head1 METHODS

=over 1

=cut


sub new
{
    my $class = shift;
    
    my %self;
  
    bless \%self, $class;
    return \%self;
}

sub start
{
    my $self = shift;
    
#    $self->{ 'thread_handle' } = threads->create( \&run, $self );
    return;
}


=item run()

Override this to implement the most atomic individual operation your task can perform.

=cut

sub run
{
    my $self = shift;
    
    print "*** STUB run\n";
    $self->run;
    return;
}



=item wait_task_status_change()

Connect to the engine, wait for status change on a task

=cut

sub wait_task_status_change
{
    my $class = shift;
    my $self = shift;
    my $tid = shift;
    
    warn "tid: $tid\n";
    
    my $queue: shared = Thread::Queue->new() or die "Couldn't create thread queue\n";
    
    $Synacor::Disbatch::Engine::EventBus->register_task_status_observer( $tid, $queue );
    my $ret = $queue->dequeue;
    return threads::shared::shared_clone( $ret );
}


sub workerthread
{
    my $self = shift or confess "no self";
    my $workerthread = $self->{workerthread} or confess "No workerthread defined";
    return $workerthread;
}

1;
