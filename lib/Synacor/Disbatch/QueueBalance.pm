package Synacor::Disbatch::QueueBalance;

use 5.12.0;
use warnings FATAL => 'uninitialized';

use boolean;
use Data::Dumper;
use List::Util qw/max min sum/;
use Synacor::Disbatch::MongoDB;
use Try::Tiny;

our $VERSION = 0.01;

=head1 SYNOPSIS

    use Synacor::Disbatch::QueueBalance;

    my $qb = Synacor::Disbatch::QueueBalance->new($config); # where $config is decoded '/etc/disbatch/config.json'
    $qb->update();

=head1 Subroutines

=over 2

=item new

=cut

sub new {
    my $this = shift;
    my $class = ref($this) || $this;
    my $config = shift;
    my $self = {};

    for my $client (keys %$config) {
        unless (defined $config->{$client}{balance}{enabled}) {
            say date(), "QueueBalance for $client not configured";
            next;
        }
        unless ($config->{$client}{balance}{enabled}) {
            say date(), "QueueBalance for $client disabled";
            next;
        }

        $self->{$client} = {
            mongo   => Synacor::Disbatch::MongoDB->new($client),
            # these are optional:
            log     => $config->{$client}{balance}{log} // false,
            verbose => $config->{$client}{balance}{verbose} // false,
            pretend => $config->{$client}{balance}{pretend} // false,
        };

        say date(), "QueueBalance for $client started";# if $self->{$client}log};
    }

    die "No clients configured for QueueBalance\n" unless keys %$self;

    bless ($self, $class);
    return $self;
}

# used by monitoring
sub _status {
    my ($client, $status, $message) = @_;
    $client->{mongo}->balance->update({}, {'$set' => { timestamp => time, status => $status, message => $message, } });
}

=item update

Updates maxthreads for all queues, for all clients.

=back

=cut

sub update {
    _update($_, $_[0]{$_}) for keys %{$_[0]};
}

sub _update {
    my ($name, $client) = @_;

    # 1. find total $max_tasks based on time of day
    my @balance = $client->{mongo}->balance->find()->all;
    try {
        die "exactly one entry allowed in balance collection, but found ", scalar @balance unless @balance == 1;
        die "balance collection does not contain key 'max_tasks'" unless defined $balance[0]->{max_tasks};
        die "balance collection does not contain key 'queues'" unless defined $balance[0]->{queues};
        die "balance collection value for 'queues is not an ARRAY'" unless ref $balance[0]->{queues} eq 'ARRAY';
    } catch {
        my $message = $_;
        _status($client, 'CRITICAL', "QueueBalance: $message");
        die "$name: $message\n";
    };

    my $max_tasks = max_tasks($balance[0]->{max_tasks});

    if (defined $balance[0]->{disabled}) {
        if (time < $balance[0]->{disabled}) {
            my $message = "disabled until " . localtime $balance[0]->{disabled};
            _status($client, 'OK', "QueueBalance $message");
            say "$name: $message"; # if $client->{verbose};
            return;
        }
        $client->{mongo}->balance->update({}, {'$set' => {disabled => undef} }) unless $client->{pretend};
        say "$name: no longer disabled";# if $client->{verbose};
    }

    my @queues = map { [ map { $client->{mongo}->queues->find_one({name => $_}) } @$_ ] } @{$balance[0]->{queues}};

    for my $p (@queues) {
        for my $queue (@$p) {
            if ($queue->{count_todo} < 0) {
                $client->{mongo}->queues->update({name => $queue->{name}}, {'$unset' => { count_todo => 1, count_total => 1 } });
                my $message = "count_todo and count_total reset for $queue->{name} because it was negative - stopping";
                _status($client, 'CRITICAL', "QueueBalance: $message");
                die "$name: $message\n";
            }
            $queue->{active} = $client->{mongo}->tasks->count({status => 0, queue => $queue->{_id}});
        }
    }

    # 2. find $default_remove which is the sum of non-default count_todo's, limit $max_tasks
    #my $default_remove = min(sum( map { $_->{count_todo} } @queues[1..@queues-1] ), $max_tasks);
    my $default_remove = min(sum( map { sum(map { $_->{count_todo} } @$_) } @queues[1..@queues-1] ), $max_tasks);

    # 3. set new $default_max which is $max_tasks - $default_remove
    #$queues[0]->{max} = $max_tasks - $default_remove;
    $_->{max} = min(int(($max_tasks - $default_remove) / @{$queues[0]}), $_->{count_todo}) for @{$queues[0]};
    my $adjust = (grep { $_->{max} < $_->{count_todo} } @{$queues[0]} )[0];
    $adjust->{max} += ($max_tasks - $default_remove) - sum(map { $_->{max} } @{$queues[0]}) if defined $adjust;

    # 4. set new $oneoff_max which is $max_tasks - max($default_active, $default_max) limit $oneoff->{count_todo}
    # 5. set new $single_max which is $max_tasks - max($default_active, $default_max) - max($oneoff_active, $oneoff_max) limit $single->{count_todo}
    my $active_max_total = 0;
    for (my $i = 1; $i < @queues; $i++) {
        $active_max_total += sum( map { max($_->{active}, $_->{max}) } @{$queues[$i-1]} );
        $_->{max} = int(max(0, min($max_tasks - $active_max_total, $_->{count_todo})) / @{$queues[$i]}) for @{$queues[$i]};
        my $adjust = (grep { $_->{max} < $_->{count_todo} } @{$queues[$i]} )[0];
        $adjust->{max} += max(0, min($max_tasks - $active_max_total, sum(map {$_->{count_todo}} @{$queues[$i]}) )) - sum(map { $_->{max} } @{$queues[$i]}) if defined $adjust;
    }

    if ($client->{verbose} > 1) {
        say "$name: active_max_total = $active_max_total";
        say "$name: default_remove = $default_remove";
        say "$name: max_tasks = $max_tasks";
        say Dumper \@queues, $adjust;
    }

    #die Dumper @queues;

    # *. apply if needed
    say "pretend ($name):" if $client->{verbose} and $client->{pretend};
    for my $p (@queues) {
        for my $queue (@$p) {
            $queue->{maxthreads} //= 0;		# disbatch.pl queue creation doesn't create this field
            if ($queue->{maxthreads} != $queue->{max}) {
                say "$name: changing $queue->{name}: $queue->{maxthreads} => $queue->{max}" if $client->{verbose};
                say date(), "$name: changing $queue->{name}: $queue->{maxthreads} => $queue->{max}" if $client->{log};
                $client->{mongo}->queues->update({name => $queue->{name}}, {'$set' => {maxthreads => $queue->{max} } }) unless $client->{pretend};
            } else {
                say "$name: no change to $queue->{name}" if $client->{verbose};
            }
        }
    }
    say '---' if $client->{verbose};
    _status($client, 'OK', 'QueueBalance is running');
}

=item max_tasks

Parameters: C<HASH> where keys are of form C<D H M> and values are integers.

Returns: integer for current max_threads allowed

  day of week  0-6 (0 is sunday), or * for all unless an explicit rule overrides it
  hour         0-23
  minute       0-59

=cut

sub max_tasks {
    my $max_threads_entries = shift // die 'Nothing passed to max_tasks';
    my $debug = shift // 0;
    use warnings FATAL => 'uninitialized';

    my $max_threads_hash = {};
    for my $k (sort keys %$max_threads_entries) {
        my ($d, $t) = split /\s+/, $k;
        my ($h, $m) = split /:/, $t;
        $h += 0;
        $m += 0;
        if ($d eq '*') {
            $max_threads_hash->{$_}{$h}{$m} = $max_threads_entries->{$k} for 0..6;
        } else {
            $max_threads_hash->{$d}{$h}{$m} = $max_threads_entries->{$k};
        }
    }

    (undef, my $min, my $hour, undef, undef, undef, my $wday) = localtime;

    my @days = (sort {$a <=> $b} keys %$max_threads_hash);
    my @eq = grep { $_ == $wday } @days;
    my @lt = grep { $_ < $wday } @days;
    my @gt = grep { $_ > $wday } @days;

    my $hour_hash = @eq ? $max_threads_hash->{$eq[0]} : @lt ? $max_threads_hash->{$lt[-1]} : $max_threads_hash->{$gt[-1]};

    my @hours = (sort {$a <=> $b} keys %$hour_hash);
    @eq = grep { $_ == $hour } @hours;
    @lt = grep { $_ < $hour } @hours;
    @gt = grep { $_ > $hour } @hours;

    my $min_hash = @eq ? $hour_hash->{$eq[0]} : @lt ? $hour_hash->{$lt[-1]} : $hour_hash->{$gt[-1]};

    my @mins = (sort {$a <=> $b} keys %$min_hash);
    @eq = grep { $_ == $min } @mins;
    @lt = grep { $_ < $min } @mins;
    @gt = grep { $_ > $min } @mins;

    my $max = @eq ? $min_hash->{$eq[0]} : @lt ? $min_hash->{$lt[-1]} : $min_hash->{$gt[-1]};

    if ($debug) {
        say Dumper $max_threads_hash;
        say "$wday $hour $min";
        say 'hour => minute : ', Dumper $hour_hash;
        say 'minute => value : ', Dumper $min_hash;
        say $max;
    }

    return $max;
}

# returns a date in local time zone to prepend to a message
sub date {
    my ($sec,$min,$hour,$mday,$mon,$year,$wday,$yday,$isdst) = localtime(time);
    my @months = qw( Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec );
    my $date = sprintf "%s %2d %02d:%02d:%02d ", $months[$mon],$mday,$hour,$min,$sec;
    return $date;
}

__END__

[ default oneoff single ] {
    begin
        maxthreads max ne {
            verbose { (changing ) print name print (: ) print maxthreads print ( => ) print max print (\n) print } if
            pretend not {
                mongo /collection get [ << /name name >> << /$set << /maxthreads max >> >> ] .update
            } if
        } {
            verbose { (no change to ) print name print (\n) print } if
        } ifelse
    end
} forall

CURRENT:
1. find total $max_tasks based on time of day
2. find $master_remove which is $oneoff->{count_todo} limit $max_tasks
3. set new $master_max which is $max_tasks - $master_remove
4. set new $oneoff_max which is $max_tasks - ( $master_active > $master_max ? $master_active : $master_max )

NEW:
1. find total $max_tasks based on time of day
2. find $master_remove which is ($oneoff->{count_todo} + $single->{count_todo}) limit $max_tasks
3. set new $master_max which is $max_tasks - $master_remove
4. set new $oneoff_max which is $max_tasks - max($master_active,$master_max) limit $oneoff->{count_todo}
5. set new $single_max which is $max_tasks - max($master_active,$master_max) - max($oneoff_active,$oneoff_max) limit $single->{count_todo}

1n. $max_tasks is always positive.
2n. $master_remove is never < 0 since count_todo values are verified to be >= 0.
3n. $master_max is never < 0 since $master_remove is limited by $max_tasks
4n. if $master_active > $max_tasks, problems for $oneoff_max -- should not let it be < 0
5n. if $master_active+$oneoff_active > $max_tasks, problems for $single_max -- should not let it be < 0

* hughes and oneoff are set to max 10|0, but processing 10|1, and running this does not change hughes max to 9

# in comes 4 oneoffs: (10 0 0)
1. 10
2.  4 = 4+0 lim 10
3.  6 = 10-4
4.  0 = 10-10
5.  0 = 10-10-0

# 2 in master finish, and 3 singles come in: (8 0 0)
1. 10
2.  7 = 4+3 lim 10
3.  3 = 10-7
4.  2 = 10-8
5.  0 = 10-8-2

# 2 more in master finish (6 2 0)
1. 10
2.  7 = 4+3 lim 10
3.  3 = 10-7
4.  4 = 10-6
5.  0 = 10-6-4

# 1 in oneoff finishes (6 3 0)
1. 10
2.  6 = 3+3 lim 10
3.  4 = 10-6
4.  3 = 10-6 lim 3
5.  1 = 10-6-3

# (6 3 1)
