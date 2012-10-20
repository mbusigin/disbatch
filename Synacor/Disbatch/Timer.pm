package Synacor::Disbatch::Timer;

use strict;

=head1 NAME 

Synacor::Timer - thread which acts as an alerting timer for Synacor::Engine.

=head1 SYNOPSIS

  use Synacor::Timer;
  my $timer_thread = Synacor::Timer->new( 3 );  # will cause awaken signal every 3 seconds
  $timer_thread->start;
  
=head1 METHODS

=over 1

=cut


=item new()

Creates new instance of Synacor::Timer object.  Optional parameters:

  $seconds		The number of seconds to wait between executions
  $callback		A reference to a callback function which is called

=cut

sub new
{
    my $class = shift;

    my $seconds = shift;
    my $callback = shift;
    
    my $self = 
    {
        'seconds'	=> $seconds ||= 60,
        'callback'	=> $callback ||= undef,
    };
    
    bless $self, $class;
    return $self;
}

=item start()

Spin up a new thread, and begin the timer process.

=cut

sub start
{
    my $self = shift;

    my $pid = fork();
    if ( $pid == 0 )
    {
        $self->thread_run;
    }    
}


sub thread_run
{
    my $self = shift;
    
    while( 1 )
    {
        sleep $self->{ 'seconds' };
        $self->{ 'callback' }->();
    }
}


1;
