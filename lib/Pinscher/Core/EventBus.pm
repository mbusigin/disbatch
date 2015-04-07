package Pinscher::Core::EventBus;

use 5.12.0;
use warnings;

use AutoLoader;
use Data::Dumper;
use File::Temp qw/ tempfile tempdir /;
use IO::Socket qw(SOCK_STREAM);
use IO::Socket::UNIX;
use IPC::Shareable (':lock');
use IPC::SysV qw(IPC_PRIVATE IPC_RMID IPC_CREAT S_IRWXU);
use POSIX qw(ceil);
use Storable qw(nfreeze thaw);
use Try::Tiny;

# our because disbatchd.pl will set these if defined in disbatch.ini
our $ebid         = 1234;
our $ipckey1      = 'svmq';
our $ipckey2      = 'idtq';
our $threadprefix = "/tmp/thread_";

# our because otherwise it won't work
our $AUTOLOAD;

sub new {
    my ($class, $self_self, $name) = @_;

    # tie VAR, 'IPC::Shareable', GLUE, OPTIONS
    # GLUE: an integer number or 4 character string that serves as a common identifier for data across process space
    tie my %sockets, 'IPC::Shareable', $ipckey1,
      {
        create    => 1,
        exclusive => 0,
        mode      => 0644,
        destroy   => 0,
      };

    tie $ebid, 'IPC::Shareable', $ipckey2,
      {
        create    => 1,
        exclusive => 0,
        mode      => 0644,
        destroy   => 0,
      };

    (tied $ebid)->shlock();
    my $id = ++$ebid;
    (tied $ebid)->shunlock();

    $id = $name;
    my $fn = $threadprefix . $id;
    unlink $fn;
    my $server = IO::Socket::UNIX->new(
        Local  => $fn,
        Type   => SOCK_STREAM,
        Listen => 2000
    ) or die "Couldn't create $fn: $!";

    $sockets{name} = $fn;

    my $self = {
        id       => $id,
        socketfn => $fn,
        socket   => $server,
        name     => $name,
        retire   => 0,
        methods  => {
            test => \&footest,
        },
        procedures => {
            test => \&footest,
        },
        self           => $self_self,
        pre_call_trap  => undef,
        post_call_trap => undef,
    };
    bless $self, $class;
}

sub AUTOLOAD {
    my $self = shift;
    my $type = ref $self or die "$self is not an object";

    my $name = $AUTOLOAD;
    $name =~ s/.*://;    # strip fully-qualified portion

    return if $name eq 'DESTROY';    # We do not AUTOLOAD destroys
    return $self->call_thread($name, @_);
}

# used once in AUTOLOAD()
sub call_thread {
    my ($self, $name, @args) = @_;

    my $frozen_payload = nfreeze([ $name, \@args ]);

    my $client = connect_udx($self->{socketfn});

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

    while (1) {
        my $retire = $self->oneiteration // 0;
        return if $retire;
    }
}

# used once in run()
sub oneiteration {
    my ($self) = @_;

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

    my $procedure = 0;
    my $func      = $self->{methods}{$command};
    unless ($func) {
        $func      = $self->{procedures}{$command};
        $procedure = 1;
        unless ($func) {
            $socket->shutdown(2);
            $socket->close;
            die "No such function or procedure '$command'\n", Dumper $self->{methods};
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

# used in new() as $self->{methods}{test} and $self->{procedures}{test}
sub footest {
    my ($self, $a, $b, $c) = @_;
    $a + $b + $c;
}

# used once in call_thread()
sub connect_udx {
    my ($socketfn) = @_;

    my $client;
    while (!($client = IO::Socket::UNIX->new(Peer => $socketfn, Type => SOCK_STREAM, Timeout => 10))) {
        if ($@ =~ /Resource temporarily unavailable/) {
            srand time * $$;
            my $sleepfor = rand(2);

            #warn "Sleeping for $sleepfor seconds as listen queue is full for $socketfn";
            select(undef, undef, undef, $sleepfor);
        } else {
            die "Couldn't connect to '$socketfn': $@";
        }
    }

    $client;
}

1;

__END__

=head1 NAME

Pinscher::Core::EventBus

=head1 FOO
