package Synacor::Disbatch::ChunkedTaskFactory;

use strict;
use Synacor::Disbatch::Task;
use Time::HiRes;
use Data::Dumper;

sub new
{
    my $class = shift;
    my ( $engine, $queueid, $group, $filter, $columns_arrayref ) = @_;

    my $self =
    {
        'engine'	=> $engine,
        'queueid'	=> $queueid,
        'group'		=> $group,
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
#    $self->{ 'users' } = $self->{ 'engine' }->{ 'groups' }->{ $self->{'group'} };
#    return 0 if !$self->{ 'users' };
    $self->{ 'cursor' } = Synacor::Disbatch::Engine::filter_users( $self->{'users'}, $self->{'filter'}, 'query' );
    return 0 if !$self->{ 'cursor' };
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
    while( Time::HiRes::tv_interval($start) <= $maxs and (my $user = $self->{'cursor'}->next) )
    {
        $x ++;
        my $username = $user->{ 'username' };
        my @params;

        foreach my $col (@{ $columns_arrayref })
        {
            if ( $col =~ /^(user\.[a-zA-Z][a-zA-Z0-9_]*)$/ )
            {
                my $var = $1;
                my $key = $var;
                $key =~ s/user\.//;
                my $val = $user->{$key};
                push @params, $val;
            }
            elsif ( $col =~ /(user\.[a-zA-Z][a-zA-Z0-9_]*)/ )
            {
                my $var = $1;
                my $key = $var;
                $key =~ s/user\.//;
                my $val = $user->{$key};
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
