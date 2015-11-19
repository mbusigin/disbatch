package Pinscher::Core::EventBus;

use 5.12.0;
use warnings;

use Data::Dumper;
use File::Temp qw/ tempfile tempdir /;
use IO::Socket qw(SOCK_STREAM);
use IO::Socket::UNIX;
use Storable qw(nfreeze thaw);
use Try::Tiny;

# our because disbatchd.pl will set these if defined in disbatch.ini
our $threadprefix = "/tmp/thread_";

sub new {
    my ($class, $self_self, $id) = @_;

    if (ref $self_self eq 'Synacor::Disbatch::Engine') {
        $self_self->logger->trace("*** $$ new $class $id");					# *** new Pinscher::Core::EventBus Synacor::Engine
    } else {
        logger({ self => $self_self })->trace("*** $$ new $class $id");				# *** new Pinscher::Core::EventBus worker#1
    }

    my $fn = $threadprefix . $id;
    unlink $fn;
    my $server = IO::Socket::UNIX->new(
        Local  => $fn,
        Type   => SOCK_STREAM,
        Listen => 2000
    ) or die "Couldn't create $fn: $!";	# FATAL: Engine::new -> disbatchd.pl
					# FATAL: WorkerThread::new -> Queue::start_thread_pool -> disbatchd.pl
					# FATAL for plugin: WorkerThread::new -> Queue::start_thread_pool -> Queue::report_task_done -> Engine::report_task_done -> plugin

    my $self = {
        id       => $id,
        socketfn => $fn,
        socket   => $server,
        name     => $id,	# FIXME: is this needed?
        retire   => 0,
        methods  => { },
        procedures => { },
        self           => $self_self,
        pre_call_trap  => undef,
        post_call_trap => undef,
    };
    bless $self, $class;
}

# used to be used once in AUTOLOAD(), now called directly by what needs it
sub call_thread {
    my ($self, $name, @args) = @_;
    $self->logger->trace(join ' ', "*** $$ call_thread $name", @args);

    my $frozen_payload = nfreeze([ $name, \@args ]);
    my $client = $self->connect_udx($self->{socketfn});
    print $client $frozen_payload;
    $client->shutdown(1);

    my $ret;
    unless ($self->{procedures}{$name}) {

        #warn "\t$self->{name} :: $name Dequeue reply\n";
        my $rcvd;
        while (<$client>) {
            $rcvd .= $_;
        }
        $client->shutdown(2);
        $ret = thaw($rcvd);

        #warn Dumper $ret;

        #warn "\t$self->{name} :: $name Semaphore up\n";
        #$self->{semaphore}->up();
    }

    $client->shutdown(2);
    $client->close;

    #warn "$self->{name} :: $name Done\n";
    return $ret->[0] if defined $ret;
}

# called by Synacor::Disbatch::WorkerThread::thread_start()
sub run {
    my ($self) = @_;
    $self->logger->trace("*** $$ run");

    while (1) {
        my $retire = $self->oneiteration // 0;
        return if $retire;
    }
}

# used once in run()
sub oneiteration {
    my ($self) = @_;
    $self->logger->trace("*** $$ oneiteration");

    my $socket = try { $self->{socket}->accept() };

    unless (defined $socket) {
        warn "\$socket for $self->{name} undefined - returning";
        return;
    }

    my $rcvd;
    try {
        while (<$socket>) {
            $rcvd .= $_;
        }
    }
    catch {
        warn "Error reading from socket: $_";
    };

    unless (defined $rcvd) {
        warn "Error reading from socket - returning";
        return;
    }

    my $message = thaw($rcvd);

    if (@{$message} != 2) {
        say "\n\nW T F: message is not 2:\n", Dumper($message), "\n";
        $socket->shutdown(2);
        $socket->close;
        next;
    }
    my $command = $message->[0];
    my $args    = $message->[1];
    $self->logger->trace("*** $$ oneiteration $command: ", ref $args eq 'ARRAY' ? join(', ', @$args) : $args );

    my $procedure = 0;
    my $func      = $self->{methods}{$command};
    unless ($func) {
        $func      = $self->{procedures}{$command};
        $procedure = 1;
        unless ($func) {
            $socket->shutdown(2);
            $socket->close;
            die "No such function or procedure '$command'\n", Dumper $self->{methods};	# FATAL (for either disbatchd.pl or plugin)
        }
    }

    my @arguments = ($self->{self}, (ref $args eq 'ARRAY') ? @$args : $args);

    $self->{pre_call_trap}->(\@arguments) if $self->{pre_call_trap};

    my $ret = $func->(@arguments);

    #warn "      Return for $command : ", Dumper $ret;
    $self->{post_call_trap}->($self, \@arguments, $ret) if $self->{post_call_trap};
    if ($procedure != 1) {
        $ret = 0 unless defined $ret;
        my $frozen_payload = nfreeze([$ret]);
        print $socket $frozen_payload;
    }

    $socket->shutdown(2);
    $socket->close;

    if ($self->{retire} == 1) {
        $self->{socket}->shutdown(2);
        $self->{socket}->close;
        return 1;
    }
}

# used once in call_thread()
sub connect_udx {
    my ($self, $socketfn) = @_;
    $self->logger->trace("*** $$ connect_udx $socketfn");

    my $client;
    while (!($client = IO::Socket::UNIX->new(Peer => $socketfn, Type => SOCK_STREAM, Timeout => 10))) {
        if ($@ =~ /Resource temporarily unavailable/) {
            srand time * $$;
            my $sleepfor = rand(2);

            #warn "Sleeping for $sleepfor seconds as listen queue is full for $socketfn";
            select(undef, undef, undef, $sleepfor);
        } else {
            die "Couldn't connect to '$socketfn': $@";	# FATAL (for either disbatchd.pl or plugin)
        }
    }

    $client;
}

sub logger {
    $_[0]->{self}{loggers}{'disbatch.engine'} // $_[0]->{self}{queue}{engine}{loggers}{'disbatch.engine'};
}

1;

__END__

=head1 NAME

Pinscher::Core::EventBus

=head1 FOO
