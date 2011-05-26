package Pinscher::Core::EventBus;

use strict;
use AutoLoader;
use Data::Dumper;
use threads;
use threads::shared;
use Thread::Queue;
use Clone qw(clone);
use Thread::Semaphore;
use Storable qw(nfreeze thaw);
use IPC::SysV qw(IPC_PRIVATE IPC_RMID IPC_CREAT S_IRWXU);
use IPC::Shareable (':lock');
use POSIX qw(ceil);
use IO::Socket qw(SOCK_STREAM);
use IO::Socket::UNIX;
use File::Temp qw/ tempfile tempdir /;


# $client = IO::Socket::UNIX->new(PeerAddr  => "/tmp/mysock",
#                                 Type      => SOCK_STREAM,
#                                Timeout   => 10 )     or die $@;


our $AUTOLOAD;
our $ebid = 1234;
our %sockets;


my $MAXQSEND = 80000;
                                

sub new
{
    my $class = shift;
    my $self_self = shift;
    my $name = shift;
    

    tie %sockets, 'IPC::Shareable', 'svmq', 
        {
            create    => 1,
            exclusive => 0,
            mode      => 0644,
            destroy   => 0,
        };
    
    tie $ebid, 'IPC::Shareable', 'idtq',
        {
            create    => 1,
            exclusive => 0,
            mode      => 0644,
            destroy   => 0,
        };
    
    (tied $ebid)->shlock();
    my $id = ++ $ebid;
    (tied $ebid)->shunlock();

    my $fn = "/tmp/thread_" . $id;
    unlink $fn;
    my $server = IO::Socket::UNIX->new(Local => $fn,
                                Type      => SOCK_STREAM,
                                Listen    => 2000 )     or die "Couldn't create $fn: $!";

    
    $sockets{ 'name' } = $fn;

    my $self = 
    {
        'id'		=> $id,
        'socketfn'	=> $fn,
        'socket'	=> $server,
        'name'		=> $name,
        'methods'       => 
                        {
                                'test'          => \&footest,
                        },
            'procedures' =>
                {
                    'test'      => \&footest,
                },
                'self'      => $self_self,
                'pre_call_trap' => undef,
                'post_call_trap' => undef,
    };
    bless $self, $class;
    
    return $self;
}


sub AUTOLOAD
{
        my $self = shift;
        my $type = ref($self)
                    or die "$self is not an object";

        my $name = $AUTOLOAD;
        $name =~ s/.*://;   # strip fully-qualified portion
        return $self->call_thread( $name, @_ );
}


sub call_thread
{
    my $self = shift;
    my $name = shift;
    my $args = \@_;
 
#    print "call_thread(): $self->{name} :: $name:\n" . Dumper( $args ) . "\n\n";
#    warn "$self->{name} :: $name Semaphore down\n";
#    $self->{'semaphore'}->down(); 
#    warn "\t$self->{name} :: $name Enqueue & clone\n";
    
    if ( !defined $self->{'procedures'}->{$name} )
    {
#        (tied $ebid)->shlock();
#        $id = ++ $ebid;
#        (tied $ebid)->shunlock();
#        $recvqueue = msgget( $id, IPC_CREAT | S_IRWXU );
#        die "Can't create receiving SysV message queue: $!" if ( !$recvqueue );
    }

#    (tied $ebid)->shlock();
    my $frozen_payload = nfreeze( [$name, $args] );

    my $client = connect_udx( $self->{'socketfn'} );
#    my $client = IO::Socket::UNIX->new(Peer  => $self->{ 'socketfn' },
#                                Type      => SOCK_STREAM,
#                                Timeout   => 10 )     or die $@;
    print $client $frozen_payload;
    $client->shutdown( 1 );
#    warn "Sent " . length($frozen_payload) . "b\n";
#    (tied $ebid)->shunlock();

    my $ret;
    goto call_thread_done if ( $self->{'procedures'}->{$name} );
    
#    warn "\t$self->{name} :: $name Dequeue reply\n";
    my $rcvd;
    while ( <$client> )
    {
        $rcvd .= $_;
    }
    $client->shutdown( 2 );
    $ret = thaw( $rcvd );
    
#    warn Dumper( $ret );

#    warn "\t$self->{name} :: $name Semaphore up\n";
#    $self->{'semaphore'}->up(); 

call_thread_done:
#    warn "$self->{name} :: $name Done\n";
    return $ret->[0] if defined($ret);
}

sub set_self
{
    my $self = shift;
    my $newself = shift;
    $self->{'self'} = shift;
}

sub run
{
    my $self = shift;
    
    while( 1 )
    {
        $self->oneiteration;
    }
}


sub oneiteration
{
        my $self = shift;

        my $socket = $self->{ 'socket' }->accept();
#        warn "Accepted $socket";
        my $rcvd;
        while ( <$socket> )
        {
            $rcvd .= $_;
        }

#        warn "received " . length($rcvd) . "b\n";
        
        my $message = thaw( $rcvd );
        
        {
                if ( scalar(@{$message}) != 2 )
                {
                    print "\n\nW T F: message is not 3:\n" . Dumper( $message ) . "\n\n";
                    next;
                }
                my $command = $message->[0];
                my $args = $message->[1];
                
                my $procedure = 0;
                my $func = $self->{methods}->{$command};
                if ( !$func )
                {
                    $func = $self->{procedures}->{$command};
                    $procedure = 1;
                    if ( !$func )
                    {
                        $socket->shutdown( 2 );
                        die "No such function or procedure '$command'\n" . Dumper( $self->{'methods'} );
                    }
                }

                my @arguments;
                push @arguments, $self->{'self'};
                if ( ref($args) eq 'ARRAY')
                    {
                        foreach my $p ( @{$args} )
                        {
                                    push @arguments, $p;
                        }
                }
                else
                {
                        push @arguments, $args;
                }


                $self->{'pre_call_trap'}->( \@arguments )
                    if ( $self->{'pre_call_trap'} );

                my $ret = $func->( @arguments ); #@{ $self, $args } );
#               warn "      Return for $command : " . Dumper( $ret );
                $self->{'post_call_trap'}->( $self, \@arguments, $ret )
                    if ( $self->{'post_call_trap'} );
                if ( $procedure != 1 )
                {
                    $ret = 0 if !defined($ret);
                    my $frozen_payload = nfreeze( [$ret] );
                    print $socket $frozen_payload;
                    $socket->shutdown( 2 );
#                    $txqueue->enqueue( threads::shared::shared_clone($ret) );
                }
                else
                {
                        $socket->shutdown( 2 );
                }
        }
}

sub footest
{
        my $self = shift;
        my ( $a, $b, $c ) = @_;
        return $a + $b + $c;
}


sub connect_udx
{
    my $socketfn = shift;
    
    my $client;
    while( !($client = IO::Socket::UNIX->new(Peer  => $socketfn,
                                Type      => SOCK_STREAM,
                                Timeout   => 10) ) )
    {
        if ( $@ =~ /Resource temporarily unavailable/ )
        {
            srand time * $$;
            my $sleepfor = rand(2);
#            warn "Sleeping for $sleepfor seconds as listen queue is full for $socketfn";
            select(undef, undef, undef, $sleepfor );
        }
        else
        {
            die "Couldn't connect to '$socketfn': $@";
        }
    }

    return $client;
}


1;
