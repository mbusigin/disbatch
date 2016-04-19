package Disbatch::Plugin::Demo;

use 5.12.0;
use warnings;

use boolean;
use Data::Dumper;

sub new {
    my ($class, $queue, $parameters) = @_;

    warn Dumper $parameters;
    my %self = map { $_ => $parameters->{$_} } keys %$parameters;       # modifying $parameters breaks something.
    $self{queue_id} = $queue->{id};
    bless \%self, $class;
}

sub run {
    my ($self) = @_;

    my $commands = $self->{commands};
    $commands = 'abc' if $commands eq '*';

    my ($status, $stdout, $stderr) = (1, '', '');

    say "You've started a dummy tasks. Congrats!";

    if ($commands =~ /a/) {
    	my $text = "This is command 'a' for apple.\n";
    	print $text;
    	$stdout .= $text;
    }

    if ($commands =~ /b/) {
    	my $text = "This is command 'b' for banana.\n";
    	warn $text;
    	$stderr .= $text;
    }

    if ($commands =~ /c/) {
    	my $text = "This is command 'c' for cry.\n";
    	warn $text;
    	$stderr .= $text;
    	$status = 2;
    	return $self->finish($status, $stdout, $stderr);;
    }

    $self->finish($status, $stdout, $stderr);
}

sub finish {
    my ($self, $status, $stdout, $stderr) = @_;

    # anything that must get done goes here:

    warn "Finished with status $status\n\nSTDOUT:\n$stdout\n\nSTDERR:\n$stderr\n";

    $status += 0;
    my $report = {
        status  => $status == 1 ? 'SUCCESS' : 'FAILED',
        done    => time,
        task_id => $self->{id},
    };
    $report->{counter} = $self->{counter} if exists $self->{counter};
    $self->{workerthread}->mongo->get_collection('reports')->insert($report) unless $self->{engineless} // false;

    {status => $status, stdout => $stdout, stderr => $stderr};
}

1;
__END__

=head1 NAME

Disbatch::Plugin::Demo - has commands 'a' (stdout, success), 'b' (stderr, success), and 'c' (stderr, failure)

=head1 NOBREAK DZIL
