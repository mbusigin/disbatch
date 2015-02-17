package Synacor::Disbatch::ChunkedTaskFactory;

use 5.12.0;
use warnings;

use Data::Dumper;
use Time::HiRes;

sub new {
    my ($class, $engine, $queueid, $collection, $filter, $parameters) = @_;

    my $self = {
        engine     => $engine,
        queueid    => $queueid,
        collection => $collection,
        filter     => $filter,
        parameters => $parameters,
    };
    bless $self, $class;

    $self->{done} = $self->{count} = 0 unless $self->init;

    $self;
}

sub init {
    my ($self) = @_;

    $self->{queue} = $self->{engine}->get_queue_by_id($self->{queueid});
    return 0 unless $self->{queue};

    $self->{cursor} = Synacor::Disbatch::Engine::filter_collection($self->{collection}, $self->{filter}, 'query');
    return 0 if !$self->{cursor} or ref $self->{cursor} eq 'HASH' and !%{$self->{cursor}};

    $self->{cursor}->immortal(1);
    $self->{count} = $self->{cursor}->count;
    $self->{done}  = 0;
    return 1;
}

sub slice {
    my ($self, $maxs) = @_;

    return unless $self->{cursor}->has_next;

    my $start = [ Time::HiRes::gettimeofday() ];
    my $x     = 0;
    while (Time::HiRes::tv_interval($start) <= $maxs and (my $document = $self->{cursor}->next)) {
        $x++;
        my $params;
        for my $key (keys %{$self->{parameters}}) {
            my $value = $self->{parameters}{$key};
            if (my ($mkey) = $value =~ /^document\.([a-zA-Z][a-zA-Z0-9_]*)$/) {
                $value = $document->{$mkey};
            } elsif (($mkey) = $value =~ /^document\.([a-zA-Z][a-zA-Z0-9_]*)/) {
                $value =~ s/document\.$mkey/$document->{$mkey}/;
            }
            $params->{$key} = $value;
        }

        $self->{queue}->create_task($params);
        $self->{done}++;
    }

    warn "$x processed this slice";
}

1;
