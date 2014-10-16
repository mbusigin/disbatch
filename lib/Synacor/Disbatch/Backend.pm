package Synacor::Disbatch::Backend;

use strict;
use warnings;
use Data::Dumper;
use MongoDB;

our $mongo;
my @redolog;

my $tasks_collection  = 'tasks';
my $queues_collection = 'queues';

=item connect_mongo()

Establish a new connection to a MongoDB.

=cut

sub connect_mongo {
    my $host     = shift;
    my $dbname   = shift;
    my $username = shift;
    my $password = shift;
    my $conn;

    my %extras;
    $extras{'username'} = $username if defined($username);
    $extras{'password'} = $password if defined($password);

    print 'Synacor::Disbatch::Backend::connect_mongo extras: ', Dumper( \%extras ) . "\n";

    if ($host) {
        $conn = MongoDB::MongoClient->new(
            host           => $host,
            auto_reconnect => 1,
            auto_connect   => 1,
            query_timeout  => 30000,
            find_master    => 1,
            %extras,
        );

    }
    else {
        $conn = MongoDB::MongoClient->new(%extras);
    }
    my $db = $conn->get_database($dbname);
    $db->authenticate( $dbname, $username, $password ) if defined($username);
    return $db;
}

=item initialise()

Initialise Backend module

=cut

sub initialise {
    my ( $host, $db, $username, $password, $xtasks_collection, $xqueues_collection ) = @_;
    $tasks_collection  = $xtasks_collection;
    $queues_collection = $xqueues_collection;
    $mongo             = connect_mongo( $host, $db, $username, $password );
    ensureIndices( $mongo, $tasks_collection, $queues_collection );
}

=item ensureIndices()

Ensure that the appropriate Disbatch indices exist.

=cut

sub ensureIndices {
    my $mongo             = shift;
    my $tasks_collection  = shift;
    my $queues_collection = shift;

    $mongo->get_collection($tasks_collection)->ensure_index(
        {
            node   => 1,
            status => 1,
            queue  => 1,
        }
    );
    $mongo->get_collection($tasks_collection)->ensure_index(
        {
            queue  => 1,
            status => 1,
        }
    );

}

=item random_pause()

Pause for a random period of time to retry for a system resource

=cut

sub random_pause {
    srand time * $$;
    my $sleepfor = rand(1);
    select( undef, undef, undef, $sleepfor );
}

=item update_collection()

Update a collection

=cut

sub update_collection {
    my ( $cid, $where, $update, $options, $extra ) = @_;

    eval {
        my $collection = $mongo->get_collection($cid);
        my $ret = $collection->update( $where, $update, $options );
        if ( !$ret ) {
            $Synacor::Disbatch::Engine::Engine->logger('mongo')->error("Couldn't update collection '$cid'!");
            die "Couldn't update collection '$cid'!";
        }
    };

    if ($@) {
        return if ( !$extra or $extra->{'retry'} eq 'no' );
        if ( $extra->{'retry'} eq 'synchronous' ) {
            random_pause();
            return update_collection(@_);
        }
        if ( $extra->{'retry'} eq 'redolog' ) {
            unshift @redolog, 'update';
            push @redolog, \@_;
            return;
        }
        $Synacor::Disbatch::Engine::Engine->logger('mongo')->error("No such retry method in update_collection on mongo timeout '$extra->{retry}'!!");
    }
}

=item update_queue()

Update a queue attribute

=cut

sub update_queue {
    my ( $queueid, $attr, $value ) = @_;
    print Dumper( \@_ );
    update_collection( $queues_collection, { '_id' => MongoDB::OID->new( value => $queueid ) }, { '$set' => { $attr => $value } }, {}, { retry => 'synchronous' } );
}

=item query_collection()

Query a Mongo collection

=cut

sub query_collection {
    my ( $cid, $hr, $attrs, $extra ) = @_;

    my $query;

    eval {
        my $collection = $mongo->get_collection($cid);
        $query = $collection->query( $hr, $attrs );
        $query->count;
    };
    if ($@) {
        $Synacor::Disbatch::Engine::Engine->logger('mongo')->warn("Error: $@");
        return undef if ( !$extra or $extra->{'retry'} eq 'no' );
        if ( $extra->{'retry'} eq 'synchronous' ) {
            random_pause();
            return query_collection(@_);
        }
        $Synacor::Disbatch::Engine::Engine->logger('mongo')->error("No such retry method in query_collection on mongo timeout '$extra->{retry}'!!");
        return undef;
    }

    return $query;
}

=item query_one()

Query a Mongo collection for the single top result

=cut

sub query_one {
    my ( $cid, $hr, $extra ) = @_;

    my $result;

    eval {
        my $collection = $mongo->get_collection($cid);
        $result = $collection->find_one($hr);
    };
    if ($@) {
        $Synacor::Disbatch::Engine::Engine->logger('mongo')->warn("Error: $@");
        return undef if ( !$extra or $extra->{'retry'} eq 'no' );
        if ( $extra->{'retry'} eq 'synchronous' ) {
            random_pause();
            return query_one(@_);
        }
        $Synacor::Disbatch::Engine::Engine->logger('mongo')->error("No such retry method in query_one on mongo timeout '$extra->{retry}'!!");
        return undef;
    }
    return $result;
}

=item count()

Count the result of a query

=cut

sub count {
    my ( $cid, $hr, $extra ) = @_;

    my $count;
    eval {
        my $collection = $mongo->get_collection($cid);
        $count = $collection->count($hr);
    };
    if ($@) {
        $Synacor::Disbatch::Engine::Engine->logger('mongo')->warn("Error: $@");
        return undef if ( !$extra or $extra->{'retry'} eq 'no' );
        if ( $extra->{'retry'} eq 'synchronous' ) {
            random_pause();
            return count(@_);
        }
        $Synacor::Disbatch::Engine::Engine->logger('mongo')->error("No such retry method in count on mongo timeout '$extra->{retry}'!!");
        return undef;
    }

    return $count;
}

=item insert_collection()

Insert into a Mongo collection

=cut

sub insert_collection {
    my ( $cid, $hr, $extra ) = @_;

    my $oid;

    eval {
        my $collection = $mongo->get_collection($cid);
        $oid = $collection->insert($hr);
    };
    if ($@) {
        return if ( !$extra or $extra->{'retry'} eq 'no' );
        if ( $extra->{'retry'} eq 'synchronous' ) {
            random_pause();
            return insert_collection(@_);
        }
        if ( $extra->{'retry'} eq 'redolog' ) {
            unshift @redolog, 'insert';
            push @redolog, \@_;
            return;
        }
        $Synacor::Disbatch::Engine::Engine->logger('mongo')->error("No such retry method in insert_collection on mongo timeout '$extra->{retry}'!!");
    }
    else {
        return $oid;
    }
}

=item delete_collection()

Delete from a Mongo collection

=cut

sub delete_collection {
    my ( $cid, $hr, $extra ) = @_;

    eval {
        my $collection = $mongo->get_collection($cid);
        $collection->remove($hr);
    };
    if ($@) {
        return if ( !$extra or $extra->{'retry'} eq 'no' );
        if ( $extra->{'retry'} eq 'synchronous' ) {
            random_pause();
            return delete_collection(@_);
        }
        if ( $extra->{'retry'} eq 'redolog' ) {
            unshift @redolog, 'delete';
            push @redolog, \@_;
            return;
        }
        $Synacor::Disbatch::Engine::Engine->logger('mongo')->error("No such retry method in delete_collection on mongo timeout '$extra->{retry}'!!");
    }
}

=item process_redolog()

Process redo log

=cut

sub process_redolog {
    while ( ( my $tx = pop @redolog ) ) {
        $Synacor::Disbatch::Engine::Engine->logger('mongo')->error("Re-do log entry is being ignored");
    }
}

1;
