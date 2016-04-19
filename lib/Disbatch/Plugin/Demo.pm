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

Disbatch::Plugin::Demo - demo plugin for Disbatch

=head1 DESCRIPTION

Has commands 'a' (stdout, success), 'b' (stderr, success), and 'c' (stderr, failure)

=head1 SUBROUTINES

=over 2

=item new($queue, $parameters)

Parameters: C<< { id => $oid } >> where C<$id> is a C<MongoDB::OID> object of the task's queue value, C<HASH> parameters value of the task.

Returns a C<Disbatch::Plugin::Demo> object.
In this demo, parameters is a C<HASH> with the key C<commands> and a value of C<a>, C<b>, C<c>, or any combination; and optionally the key C<counter>.
This example will overwrite the parameter C<queue_id> if used.
Any other characters in the C<commands> value are ignored, as well as any other keys.
Parameters does not have to be a C<HASH> in your plugin – it can be any value MongoDB can store.

The L<task_runner> command will overwrite any parameter with key name C<id> or C<workerthread>,
as these are used to store the C<MongoDB::OID> object of the task and the C<Disbatch> object, respectively.

=item run

Parameters: none

Runs the task.

Returns the result of C<finish()>.

=item finish($status, $stdout, $stderr)

Parameters: status (positive integer: 1 for success or 2 for failure), stdout (string), stderr (string)

Creates the report for this task and inserts into the C<reports> collection.

Returns two C<HASH>es: a query for the task and the result to update the task with.

The query is ignored, and the result I<SHOULD> have the keys C<status> (1 for success, 2 for failure), C<stdout>, and C<stderr>.
Other keys will be ignored.

=back

=head1 SEE ALSO

L<Disbatch>

L<Disbatch::Web>

L<Disbatch::Roles>

L<disbatchd>

L<disbatch.pl>

L<task_runner>

L<disbatch-create-users>

=head1 AUTHORS

Ashley Willis <awillis@synacor.com>

=head1 COPYRIGHT AND LICENSE

This software is Copyright (c) 2016 by Ashley Willis.

This is free software, licensed under:

  The Apache License, Version 2.0, January 2004
