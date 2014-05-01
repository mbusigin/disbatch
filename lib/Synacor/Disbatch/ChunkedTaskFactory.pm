package Synacor::Disbatch::ChunkedTaskFactory;

use strict;
use Synacor::Disbatch::Task;
use Time::HiRes;
use Data::Dumper;

sub new
{
    my $class = shift;

    my ( $engine, $queueid, $collection, $filter, $parameters_hashref ) = @_;

    my $self =
    {
        'engine'        => $engine,
        'queueid'       => $queueid,
        'collection'    => $collection,
        'filter'        => $filter,
        'parameters'    => $parameters_hashref,
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
    $self->{ 'cursor' } = Synacor::Disbatch::Engine::filter_collection( $self->{'collection'}, $self->{'filter'}, 'query' );
    return 0 if !$self->{ 'cursor' } or (ref($self->{cursor}) eq 'HASH' and !%{$self->{cursor}});
    $self->{ 'cursor' }->immortal( 1 );
    $self->{ 'count' } = $self->{ 'cursor' }->count();
    $self->{ 'done' } = 0;
    return 1;
}


sub slice
{
    my $self = shift;
    my $maxs = shift;

    return if !($self->{'cursor'}->has_next);

    my $parameters_hashref = $self->{ 'parameters' };
    my $start = [ Time::HiRes::gettimeofday( ) ];

    my $x = 0;
    while( Time::HiRes::tv_interval($start) <= $maxs and (my $document = $self->{'cursor'}->next) )
    {
        $x ++;
        my %params;

        foreach my $key ( keys %{ $parameters_hashref })
        {
            my $value = $parameters_hashref->{ $key };

            if ( $value =~ /^(document\.[a-zA-Z][a-zA-Z0-9_]*)$/ )
            {
                my $var = $1;
                my $mkey = $var;
                $mkey =~ s/document\.//;
                my $val = $document->{$mkey};
                $params{ $key} = $val;
            }
            elsif ( $value =~ /(document\.[a-zA-Z][a-zA-Z0-9_]*)/ )
            {
                my $var = $1;
                my $mkey = $var;
                $mkey =~ s/document\.//;
                my $val = $document->{$mkey};
                my $subs = $value;
                $subs =~ s/$var/$val/;
                $params{ $key } = $subs;
            }
            else
            {
                $params{ $key } = $value;
            }

        }
        my $iobject = $self->{'queue'}->create_task( \%params );
        $self->{ 'done' } ++;
    }

    warn "$x processed this slice";
}


1;
