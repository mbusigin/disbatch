package Synacor::Disbatch::WorkerThread;

use 5.12.0;
use warnings;

use Carp;
use Data::Dumper;
use Pinscher::Core::EventBus;
use Synacor::Disbatch::Engine;
use Try::Tiny;

sub new {
    my ($class, $id, $queue) = @_;

    my $self = {
        eb        => Pinscher::Core::EventBus->new(bless({}, $class), "worker#$id"),
        id        => $id,
        queue     => $queue,
        config    => $Synacor::Disbatch::Engine::Engine->{config},
        data      => {},
        tasks_run => 0,
    };

    $self->{eb}{procedures}{start_task} = \&start_task;
    $self->{eb}{methods}{retire}        = \&retire;

    bless $self, $class;

    $self->thread_start;

    $self;
}

sub start_task {
    my ($self, $task) = @_;
    confess "No task!" unless $task;

    if (!$self->{id}) {
        confess "No 'id'!";
        return 1;
    }

    #print $self->{ 'id' } . ': ' . ref($task) . "\n";
    $task->{workerthread} = $self;

    try {
        $task->run($self);
    }
    catch {
        $self->logger("Thread has uncaught exception: $_");
        $Synacor::Disbatch::Engine::EventBus->report_task_done($task->{queue_id}, $task->{_id}, 2, 'Unable to complete', "Thread has uncaught exception: $_");
    };

    1;
}

sub retire {
    my ($self) = @_;
    $self->{eb}{retire} = 1;
}

sub thread_start {
    my ($self) = @_;

    defined(my $pid = fork) or die "fork failed: $!";
    if (!$pid) {
        $self->{eb}->run;
        $self->logger->info("This thread $$ has outlived its usefulness");
        exit 0;
    }

    $self->{pid} = $pid;
    return $pid;
}

# NOTE: is this used?
sub kill {
    my ($self) = @_;
    if (kill 'KILL', $self->{pid}) {
        say 'killed ' . __PACKAGE__ . " with PID $self->{pid}";
    } else {
        say 'could not kill ' . __PACKAGE__ . " with PID $self->{pid}";
    }
}

# NOTE: is this used?
sub logger {
    my ($self, $type) = @_;
    my $classname = ref $self->{queue};
    $classname =~ s/^.*:://;

    my $logger = defined $type ? "disbatch.plugins.$classname.$type" : "disbatch.engine.$classname";

    if (!$self->{log4perl_initialised}) {
        Log::Log4perl::init($self->{config}{log4perl_conf});
        $self->{log4perl_initialised} = 1;
        $self->{loggers}              = {};
    }

    $self->{loggers}{$logger} //= Log::Log4perl->get_logger($logger);
    $self->{loggers}{$logger};
}

# NOTE: i think this is used by plugins.
sub mongo {
    my ($self) = @_;
    $self->{mongo} //= Synacor::Disbatch::Backend::connect_mongo($self->{config}->{mongohost}, $self->{config}->{mongodb});
    $self->{mongo};
}

# NOTE: i don't think this is used anywhere.
sub set {
    confess "No value!" unless @_ == 3;
    $_[0]->{data}{$_[1]} = $_[2];
}

# NOTE: i don't think this is used anywhere.
sub get {
    confess "No key!" unless @_ == 2;
    $_[0]->{data}{$_[1]};
}

# NOTE: i don't think this is used anywhere.
sub unset {
    confess "No key!" unless @_ == 2;
    delete $_[0]->{data}{$_[1]};
}

1;

__END__

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

=item new()

Creates a new Synacor::Disbatch::WorkerThread.

Arguments:

  $id		The ID for the new worker thread

=item start_task()

Begin work on a new Synacor::Disbatch::Task.

Arguments:

  $task		Task to work on

=item thread_start()

Start thread, return PID.  This happens automatically with the default constructor.

=item kill()

Kills worker thread.

