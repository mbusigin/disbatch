package Synacor::Disbatch::Backend;

use strict;
use warnings;
use Data::Dumper;
use MongoDB;


our $mongo;
my @redolog;

=item connect_mongo()

Establish a new connection to a MongoDB.

=cut

sub connect_mongo
{
    warn "connect_mongo";
    my $host = shift;
    my $dbname = shift;
    my $conn;
    if ( $host )
    {
        $conn = MongoDB::Connection->new( 
                                            host => $host,
                                            auto_reconnect => 1,
                                            auto_connect => 1,
                                            query_timeout => 30000,
                                            find_master => 1,
                                        );
        
    }
    else
    {   
        $conn = MongoDB::Connection->new;
    }
    my $db = $conn->get_database( $dbname );
    return $db;
}


=item initialise()

Initialise Backend module

=cut

sub initialise
{
    warn "initialise mongo";
    my ( $host, $db ) = @_;
    $mongo = connect_mongo( $host, $db );

    warn "initialised mongo";
}


=item random_pause()

Pause for a random period of time to retry for a system resource

=cut

sub random_pause
{
    srand time * $$;
    my $sleepfor = rand(1);
    select(undef, undef, undef, $sleepfor);
}


=item update_collection()

Update a collection

=cut

sub update_collection
{
    my ( $cid, $where, $update, $options, $extra ) = @_;

    eval
    {
        my $collection = $mongo->get_collection( $cid );
        my $ret = $collection->update( $where, $update, $options );
        if ( !$ret )
        {
            die "Couldn't write!!!!";
        }
    };
    
    if ( $@ )	
    {
        return if ( !$extra or $extra->{'retry'} eq 'no' );
        if ( $extra->{'retry'} eq 'synchronous' )
        {
            random_pause();
            return update_collection( @_ );
        }
        if ( $extra->{'retry'} eq 'redolog' )
        {
            unshift @redolog, 'update';
            push @redolog, \@_;
            return;
        }
        warn "No such retry method in update_collection on mongo timeout '$extra->{retry}'!!";
    }
}


=item update_queue()

Update a queue attribute

=cut

sub update_queue
{
    my ( $queueid, $attr, $value ) = @_;
    update_collection( 'queues', {'_id' => $queueid}, { '$set' => {$attr => $value} }, {}, {retry => 'synchronous'} );
}

=item query_collection()

Query a Mongo collection

=cut

sub query_collection
{
    my ( $cid, $hr, $attrs, $extra ) = @_;
    
    
    my $query;
    
    eval
    {
        my $collection = $mongo->get_collection( $cid );
        $query = $collection->query( $hr, $attrs );
        $query->count;
    };
    if ( $@ )
    {
        warn "Error: $@";
        return undef if ( !$extra or $extra->{'retry'} eq 'no' );
        if ( $extra->{'retry'} eq 'synchronous' )
        {
            random_pause();
            return query_collection( @_ );
        }
        warn "No such retry method in query_collection on mongo timeout '$extra->{retry}'!!";
        return undef;
    }
    
    return $query;
}

=item query_one()

Query a Mongo collection for the single top result

=cut

sub query_one
{
    my ( $cid, $hr, $extra ) = @_;
    
    my $result;

    eval
    {
        my $collection = $mongo->get_collection( $cid );
        $result = $collection->find_one( $hr );
    };
    if ( $@ )
    {
        warn "Error: $@";
        return undef if ( !$extra or $extra->{'retry'} eq 'no' );
        if ( $extra->{'retry'} eq 'synchronous' )
        {
            random_pause();
            return query_one( @_ );
        }
        warn "No such retry method in query_one on mongo timeout '$extra->{retry}'!!";
        return undef;
    }
    return $result;
}


=item count()

Count the result of a query

=cut

sub count
{
    my ( $cid, $hr, $extra ) = @_;
    
    my $count;
    eval
    {
        my $collection = $mongo->get_collection( $cid );
        $count = $collection->count( $hr );
    };
    if ( $@ )
    {
        warn "Error: $@";
        return undef if ( !$extra or $extra->{'retry'} eq 'no' );
        if ( $extra->{'retry'} eq 'synchronous' )
        {
            random_pause();
            return count( @_ );
        }
        warn "No such retry method in count on mongo timeout '$extra->{retry}'!!";
        return undef;
    }
    
    
    return $count;
}


=item insert_collection()

Insert into a Mongo collection

=cut

sub insert_collection
{
    my ( $cid, $hr, $extra ) = @_;
    
    my $oid;
    
    eval
    {
        my $collection = $mongo->get_collection( $cid );
        $oid = $collection->insert( $hr );
    };
    if ( $@ )	
    {
        return if ( !$extra or $extra->{'retry'} eq 'no' );
        if ( $extra->{'retry'} eq 'synchronous' )
        {
            random_pause();
            return insert_collection( @_ );
        }
        if ( $extra->{'retry'} eq 'redolog' )
        {
            unshift @redolog, 'insert';
            push @redolog, \@_;
            return;
        }
        warn "No such retry method in insert_collection on mongo timeout '$extra->{retry}'!!";
    }
    else
    {
        return $oid;
    }
}


=item delete_collection()

Delete from a Mongo collection

=cut

sub delete_collection
{
    my ( $cid, $hr, $extra ) = @_;
    
    eval
    {
        my $collection = $mongo->get_collection( $cid );
        $collection->remove( $hr );
    };
    if ( $@ )	
    {
        return if ( !$extra or $extra->{'retry'} eq 'no' );
        if ( $extra->{'retry'} eq 'synchronous' )
        {
            random_pause();
            return delete_collection( @_ );
        }
        if ( $extra->{'retry'} eq 'redolog' )
        {
            unshift @redolog, 'delete';
            push @redolog, \@_;
            return;
        }
        warn "No such retry method in delete_collection on mongo timeout '$extra->{retry}'!!";
    }
}


=item process_redolog()

Process redo log

=cut

sub process_redolog
{
    while ( (my $tx = pop @redolog) )
    {
        warn Dumper( $tx );
    }
}


1;
