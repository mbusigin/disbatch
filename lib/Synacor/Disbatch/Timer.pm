package Synacor::Disbatch::Timer;

use 5.12.0;
use warnings;

sub new {
    my ($class, $seconds, $callback) = @_;

    my $self = {
        seconds => $seconds // 60,
        callback => $callback,
    };

    bless $self, $class;
}

sub start {
    my ($self) = @_;

    defined(my $pid = fork) or die "fork failed: $!";	# FATAL
    while (!$pid) {
        sleep $self->{seconds};
        $self->{callback}->();
    }
    $self->{pid} = $pid;
    return $pid;
}

sub kill {
    my ($self) = @_;
    if (kill 'KILL', $self->{pid}) {
        say 'killed ' . __PACKAGE__ . " with PID $self->{pid}";
    } else {
        say 'could not kill ' . __PACKAGE__ . " with PID $self->{pid}";
    }
}

1;

__END__

=head1 NAME

Synacor::Timer - thread which acts as an alerting timer for Synacor::Disbatch::Engine.

=head1 SYNOPSIS

  use Synacor::Timer;
  my $timer_thread = Synacor::Timer->new( 3 );  # will cause awaken signal every 3 seconds
  $timer_thread->start;

=head1 METHODS

=over 1

=item new

Creates new instance of Synacor::Timer object.  Optional parameters:

  $seconds		The number of seconds to wait between executions
  $callback		A reference to a callback function which is called

=item start

Spin up a new thread, and begin the timer process. Returns PID.

=item kill

Kills timer thread

