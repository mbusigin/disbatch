package Synacor::Disbatch::Timer;

use strict;

sub new {
    my $class = shift;

    my $seconds  = shift;
    my $callback = shift;

    my $self = {
        'seconds'  => $seconds  ||= 60,
        'callback' => $callback ||= undef,
    };

    bless $self, $class;
    return $self;
}

sub start {
    my $self = shift;

    my $pid = fork();
    if ( $pid == 0 ) {
        $self->thread_run;
    }
    $self->{pid} = $pid;
    return $pid;
}

sub thread_run {
    my $self = shift;

    while (1) {
        sleep $self->{'seconds'};
        $self->{'callback'}->();
    }
}

sub kill {
    my $self = shift;
    if ( kill 'KILL', $self->{pid} ) {
        print 'killed ' . __PACKAGE__ . " with PID $self->{pid}\n";
    }
    else {
        print 'could not kill ' . __PACKAGE__ . " with PID $self->{pid}\n";
    }
}

1;

__END__

=head1 NAME

Synacor::Timer - thread which acts as an alerting timer for Synacor::Engine.

=head1 SYNOPSIS

  use Synacor::Timer;
  my $timer_thread = Synacor::Timer->new( 3 );  # will cause awaken signal every 3 seconds
  $timer_thread->start;

=head1 METHODS

=over 1

=item new()

Creates new instance of Synacor::Timer object.  Optional parameters:

  $seconds		The number of seconds to wait between executions
  $callback		A reference to a callback function which is called

=item start()

Spin up a new thread, and begin the timer process. Returns PID.

=item kill()

Kills timer thread

