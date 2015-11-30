package Synacor::Disbatch::Backend;

use 5.12.0;
use warnings;

use Data::Dumper;
use MongoDB;
use Tie::IxHash;
use Try::Tiny;

# used in Synacor::Disbatch::Queue and Synacor::Disbatch::Engine as $Synacor::Disbatch::Engine::mongo
our $mongo;

my $tasks_collection  = 'tasks';
my $queues_collection = 'queues';

sub connect_mongo {
    my ($host, $dbname, $username, $password) = @_;

    my $extras;
    $extras->{username} = $username if defined $username;
    $extras->{password} = $password if defined $password;

    say 'Synacor::Disbatch::Backend::connect_mongo extras: ', Dumper $extras;

    my $conn = MongoDB::MongoClient->new(
        host => $host // 'localhost',
        socket_timeout_ms  => 60000,
        %$extras,
    );
    my $db = $conn->get_database($dbname);
    $db->authenticate($dbname, $username, $password) if defined $username;
    $db;
}

sub initialise {

    # FIXME: this looks like it will always overwrite the defaults, even if undef
    my ($host, $db, $username, $password, $xtasks_collection, $xqueues_collection) = @_;
    $tasks_collection  = $xtasks_collection;
    $queues_collection = $xqueues_collection;
    $mongo             = connect_mongo($host, $db, $username, $password);
    ensureIndices($mongo, $tasks_collection);
}

sub ensureIndices {
    my ($mongo, $tasks_collection) = @_;

    my @task_indexes = (
        { keys => [node => 1, status => 1, queue => 1] },
        { keys => [node => 1, status => 1, queue => 1, _id => 1] },
        { keys => [node => 1, status => 1, queue => 1, _id => -1] },
        { keys => [queue => 1, status => 1] },
    );

    $mongo->get_collection( $tasks_collection )->indexes->create_many(@task_indexes);

}

sub random_pause {
    select(undef, undef, undef, rand 1);
}

sub update_collection {
    my ($cid, $where, $update, $options, $extra) = @_;

    try {
        my $ret;
        if (delete $options->{multiple}) {
            $ret = $mongo->get_collection($cid)->update_many($where, $update, $options);
        } else {
            $ret = $mongo->get_collection($cid)->update_one($where, $update, $options);
        }
        if (!$ret) {
            $Synacor::Disbatch::Engine::Engine->logger('mongo')->error("Couldn't update collection '$cid'!");
            die "Couldn't update collection '$cid'!";
        }
        1;
    } catch {
        return 0 if (!$extra or $extra->{retry} eq 'no');
        if ($extra->{retry} eq 'synchronous') {
            random_pause();
            return update_collection(@_);
        }
        $Synacor::Disbatch::Engine::Engine->logger('mongo')->error("No such retry method in update_collection on mongo timeout '$extra->{retry}'!!");
        0;
    };
}

sub update_queue {
    my ($queueid, $attr, $value) = @_;
    print Dumper \@_;
    update_collection($queues_collection, {_id => MongoDB::OID->new(value => $queueid)}, {'$set' => {$attr => $value}}, {}, {retry => 'synchronous'});
}

sub query_collection {
    my ($cid, $hr, $attrs, $extra) = @_;
    my $query;

    eval {
        my $collection = $mongo->get_collection($cid);
        $query = $collection->find($hr, $attrs);
        $query->count;		# FIXME: why is this even here? this seems like it would cause extra delays and load
    };
    if ($@) {
        $Synacor::Disbatch::Engine::Engine->logger('mongo')->warn("Error: $@");
        return undef if (!$extra or $extra->{retry} eq 'no');
        if ($extra->{retry} eq 'synchronous') {
            random_pause();
            return query_collection(@_);
        }
        $Synacor::Disbatch::Engine::Engine->logger('mongo')->error("No such retry method in query_collection on mongo timeout '$extra->{retry}'!!");
        return undef;
    }
    $query;
}

sub query_one {
    my ($cid, $hr, $extra) = @_;
    my $result;

    eval {
        my $collection = $mongo->get_collection($cid);
        $result = $collection->find_one($hr);
    };
    if ($@) {
        $Synacor::Disbatch::Engine::Engine->logger('mongo')->warn("Error: $@");
        return undef if (!$extra or $extra->{retry} eq 'no');
        if ($extra->{retry} eq 'synchronous') {
            random_pause();
            return query_one(@_);
        }
        $Synacor::Disbatch::Engine::Engine->logger('mongo')->error("No such retry method in query_one on mongo timeout '$extra->{retry}'!!");
        return undef;
    }
    $result;
}

sub count {
    my ($cid, $hr, $extra) = @_;
    my $count;

    eval {
        my $collection = $mongo->get_collection($cid);
        $count = $collection->count($hr);
    };
    if ($@) {
        $Synacor::Disbatch::Engine::Engine->logger('mongo')->warn("Error: $@");
        return undef if (!$extra or $extra->{retry} eq 'no');
        if ($extra->{retry} eq 'synchronous') {
            random_pause();
            return count(@_);
        }
        $Synacor::Disbatch::Engine::Engine->logger('mongo')->error("No such retry method in count on mongo timeout '$extra->{retry}'!!");
        return undef;
    }
    $count;
}

sub insert_collection {
    my ($cid, $hr, $extra) = @_;
    my $res;

    eval {
        my $collection = $mongo->get_collection($cid);
        $res = $collection->insert_one($hr);
    };
    if ($@) {
        return if (!$extra or $extra->{retry} eq 'no');
        if ($extra->{retry} eq 'synchronous') {
            random_pause();
            return insert_collection(@_);
        }
        $Synacor::Disbatch::Engine::Engine->logger('mongo')->error("No such retry method in insert_collection on mongo timeout '$extra->{retry}'!!");
        return undef;
    }
    $res->inserted_id;
}

sub delete_collection {
    my ($cid, $hr, $extra) = @_;

    eval {
        my $collection = $mongo->get_collection($cid);
        $collection->delete_one($hr);
    };
    if ($@) {
        return if (!$extra or $extra->{retry} eq 'no');
        if ($extra->{retry} eq 'synchronous') {
            random_pause();
            return delete_collection(@_);
        }
        $Synacor::Disbatch::Engine::Engine->logger('mongo')->error("No such retry method in delete_collection on mongo timeout '$extra->{retry}'!!");
    }
}

1;

__END__

=head1 NAME

Synacor::Disbatch::Backend

=head1 SUBS

=over2

=item connect_mongo()

Establish a new connection to a MongoDB.

=item initialise()

Initialise Backend module

=item ensureIndices()

Ensure that the appropriate Disbatch indices exist.

=item random_pause()

Pause for a random period of time to retry for a system resource

=item update_collection()

Update a collection

=item update_queue()

Update a queue attribute

=item query_collection()

Query a Mongo collection

=item query_one()

Query a Mongo collection for the single top result

=item count()

Count the result of a query

=item insert_collection()

Insert into a Mongo collection

=item delete_collection()

Delete from a Mongo collection

=back
