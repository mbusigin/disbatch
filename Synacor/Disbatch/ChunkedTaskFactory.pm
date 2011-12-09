package Synacor::Disbatch::ChunkedTaskFactory;

use strict;
use Synacor::Disbatch::Task;
use Time::HiRes;
use Data::Dumper;

sub new
{
    my $class = shift;
    
    my ( $engine, $queueid, $collection, $filter, $columns_arrayref ) = @_;

    my $self =
    {
        'engine'	=> $engine,
        'queueid'	=> $queueid,
        'collection'	=> $collection,
        'filter'	=> $filter,
        'columns'	=> $columns_arrayref,
    };
    bless $self, $class;

    $self->{ 'done' } = $self->{ 'count' } = 0
        if !$self->init;
    
    return $self;
}


sub init
{
    my $self = shift;
    $self->{ 'queue' } = $self->{'engine'}->get_queue_by_id( $self->{'queueid'} );
    return 0 if !$self->{ 'queue' };
    print "init $self->{filter}\n";
    $self->{ 'cursor' } = Synacor::Disbatch::Engine::filter_collection( $self->{'collection'}, $self->{'filter'}, 'query' );
    warn Dumper(ref($self->{'cursor'}));
    return 0 if !$self->{ 'cursor' } or (ref($self->{cursor}) eq 'HASH' and !%{$self->{cursor}});
    $self->{ 'cursor' }->immortal( 1 );
    $self->{ 'count' } = $self->{ 'cursor' }->count();
    warn "Count is $self->{count}";
    $self->{ 'done' } = 0;
    return 1;
}


sub slice
{
    my $self = shift;
    my $maxs = shift;
    
    return if !($self->{'cursor'}->has_next);

    my $columns_arrayref = $self->{ 'columns' };
    my $start = [ Time::HiRes::gettimeofday( ) ];

    my $x = 0;    
    while( Time::HiRes::tv_interval($start) <= $maxs and (my $document = $self->{'cursor'}->next) )
    {
        $x ++;
        my @params;

        foreach my $col (@{ $columns_arrayref })
        {
            if ( $col =~ /^(document\.[a-zA-Z][a-zA-Z0-9_]*)$/ )
            {
                my $var = $1;
                my $key = $var;
                $key =~ s/document\.//;
                my $val = $document->{$key};
                push @params, $val;
            }
            elsif ( $col =~ /(document\.[a-zA-Z][a-zA-Z0-9_]*)/ )
            {
                my $var = $1;
                my $key = $var;
                $key =~ s/document\.//;
                my $val = $document->{$key};
                my $subs = $col;
                $subs =~ s/$var/$val/;
                push @params, $subs;  
            }
            else
            {   
                push @params, $col;
            }

        }
        my $iobject = $self->{'queue'}->create_task( \@params );
        $self->{ 'done' } ++;
    }
    
    warn "$x processed this slice";
}


1;
