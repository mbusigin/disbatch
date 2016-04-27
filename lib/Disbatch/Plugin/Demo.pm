package Disbatch::Plugin::Demo;

use 5.12.0;
use warnings;

use boolean;
use Data::Dumper;

sub new {
    my $class = shift;

    # deprecated Disbatch 3 format
    if (ref $_[0]) {
        my ($queue, $parameters) = @_;
        warn Dumper $parameters;
        my %self = map { $_ => $parameters->{$_} } keys %$parameters;       # modifying $parameters breaks something in Disbatch 3.
        $self{queue_id} = $queue->{id};
        return bless \%self, $class;
    }

    my $self = { @_ };
    warn Dumper $self->{task}{parameters};

    # back-compat, so as to not change Disbatch 3 plugins so much
    # stick all params in $self
    for my $param (keys %{$self->{task}{parameters}}) {
        next if $param eq 'workerthread' or $param eq 'task';
        $self->{$param} = $self->{task}{parameters}{$param};
    }
    $self->{queue_id} = $self->{task}{queue};
    $self->{id} = $self->{task}{_id};

    bless $self, $class;
}

sub run {
    my ($self) = @_;

    $self->{commands} = 'abc' if $self->{commands} eq '*';

    $self->{report} = {
        counter  => $self->{counter},
        commands => $self->{commands},
        task_id  => $self->{task}{_id},
        queue_id => $self->{task}{queue},
        version  => $Disbatch::Plugin::Demo::VERSION,
        started  => time,
        errors   => 0,
    };

    say "You've started a dummy tasks. Congrats!";

    if ($self->{commands} =~ /a/) {
        my $text = "This is command 'a' for apple.\n";
        print $text;
        $self->{stdout} .= $text;
    }

    if ($self->{commands} =~ /b/) {
        my $text = "This is command 'b' for banana.\n";
        warn $text;
        $self->{stderr} .= $text;
        $self->{report}{errors}++;
    }

    if ($self->{commands} =~ /c/) {
        my $text = "This is command 'c' for cry.\n";
        warn $text;
        $self->{stderr} .= $text;
        $self->{status} = 2;
        $self->{report}{errors}++;
        $self->{report}{error} = "Task failed: $text";
        return $self->finish;
    }

    $self->{status} = 1;

    $self->finish;
}

sub finish {
    my ($self) = @_;

    # anything that must get done goes here:

    warn "Finished with status $self->{status}\n\nSTDOUT:\n$self->{stdout}\n\nSTDERR:\n$self->{stderr}\n";

    $self->{status} += 0;

    $self->{report}{completed} = time;
    $self->{report}{status} = $self->{status} == 1 ? 'SUCCESS' : 'FAILED',

    $self->{workerthread}->mongo->get_collection('reports')->insert($self->{report}) unless $self->{noreport} // false;

    {status => $self->{status}, stdout => $self->{stdout}, stderr => $self->{stderr}};
}

1;

__END__

=head1 NAME

Disbatch::Plugin::Demo - demo plugin for Disbatch

=head1 DESCRIPTION

A sample Disbatch plugin.

Tasks for this plugin should have in C<parameters> the name C<commands> with a value of C<a>, C<b>, C<c>, or any combination, and optionally the name C<counter>.
Any other characters in the C<commands> value are ignored, as well as any other names in C<parameters>.

Command C<a> will write to C<stdout> and succeed with status 1.

Command C<b> will write to C<stderr> and succeed with status 1.

Command C<c> will write to C<stderr> and fail with status 2.

=head1 SUBROUTINES

=over 2

=item new(workerthread => $workerthread, task => $doc);

Parameters: C<<$workerthread>> is a C<Disbatch> object from C<task_runner> using the `plugin` MongoDB user and role,
C<$doc> is the task document from MongoDB.

Returns a C<Disbatch::Plugin::Demo> object.

In this demo, the parameters passed become C<$self>, and all of the task's parameters are put into C<$self>, unless they are named C<workerthread> or C<task>.
In addition, C<<$self->{queue_id}>> is set to the task's queue id, and C<<$self->{id}>> is set to the task's id.
This allows minimal modification to Disbatch 3 plugins.

=item new($queue, $parameters)

I<DEPRECATED FORMAT> for usage with Disbatch 3.

Parameters: C<< { id => $oid } >> where C<$id> is a C<MongoDB::OID> object of the task's queue value, C<HASH> parameters value of the task.

Returns a C<Disbatch::Plugin::Demo> object.

In this demo, the task's parameters become C<$self>, and C<<$self->{queue_id}>> is set to C<<$queue->{id}>>.

=item run

Parameters: none

Runs the task.

Returns the result of C<finish()>.

=item finish

Parameters: none

Finalizes the report for this task and inserts into the C<reports> collection.

Returns a C<HASH> result to update the task with.

The result I<SHOULD> have the keys C<status> (1 for success, 2 for failure), C<stdout>, and C<stderr>.
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
