package Synacor::Disbatch::MongoDB;

use 5.12.0;
use warnings;

use File::Slurp qw/read_file/;
use JSON;
use MongoDB;
use Synacor::Disbatch::Utils;

my $utils = Synacor::Disbatch::Utils->new();

=head1 NAME

Synacor::Disbatch::MongoDB - Disbatch-specific interface to MongoDB

=head1 SYNOPSIS

  use Synacor::Disbatch::MongoDB;

  my $mongo = Synacor::Disbatch::MongoDB->new($client);
  my $foo = $mongo->collection('foo');
  $mongo->queues->find->all;

=head1 SUBROUTINES

Note: this requires a specific C<config.json> to be in C<$PWD>.

=over 2

=item new

Params: C<client_name>

Returns: C<Synacor::Disbatch::MongoDB> object

=item connection

Returns: C<MongoDB::MongoClient> object

=item database

Returns: C<MongoDB::Database> object

=item collection

Params: C<collection_name>

Returns: C<MongoDB::Collection> object for a collection named C<collection_name>

=item tasks

=item reports

=item queues

=item users

=item balance

=item analysis

Returns: C<MongoDB::Collection> object for a collection matching name of sub.

=cut

sub new {
    my $class = shift;
    my $client = shift // die "must pass a client name to new()";
    my $config_file = shift // 'config.json';
    my $schema_file = shift // 'schema-config.json';
    my $config = $utils->load_config('/etc/disbatch/config.json', '/etc/disbatch/schema-config.json');

    my $self = {};
    $self->{_config} = $config->{$client}{mongodb};
    die "client '$client' not defined in config.json" unless defined $self->{_config};
    die "invalid/nonexistant connection key" unless defined $self->{_config}{connection} and ref $self->{_config}{connection} eq 'HASH';
    die "no database defined" unless defined $self->{_config}{database};
    die "invalid/nonexistant collection key" unless defined $self->{_config}{collections} and ref $self->{_config}{collections} eq 'HASH';

    $self->{_connection} = MongoDB::MongoClient->new( %{$self->{_config}{connection}} );
    $self->{_db} = $self->{_connection}->get_database( $self->{_config}{database} );
    $self->{$_} = $self->{_db}->get_collection( $self->{_config}{collections}{$_} ) for keys %{ $self->{_config}{collections} };
    bless $self, $class;
}

sub connection {
    my $self = shift;
    die "invalid/nonexistant connection key" unless defined $self->{_config}{connection} and ref $self->{_config}{connection} eq 'HASH';
    $self->{_connection} //= MongoDB::MongoClient->new( %{$self->{_config}{connection}} );
    return $self->{_connection};
}

sub database {
    my $self = shift;
    die "" unless defined $self->{_config}{database};
    $self->{_db} //= $self->connection->get_database( $self->{_config}{database} );
    return $self->{_db};
}

sub collection {
    my $self = shift;
    my $coll_key = shift;
    die "collection key '$coll_key' not found" unless defined $self->{_config}{collections}{$coll_key};
    $self->{$coll_key} //= $self->database->get_collection( $self->{_config}{collections}{$coll_key} );
    return $self->{$coll_key};
}

sub tasks {
    collection(shift, 'tasks');
}

sub reports {
    collection(shift, 'reports');
}

sub queues {
    collection(shift, 'queues');
}

sub users {
    collection(shift, 'users');
}

sub balance {
    collection(shift, 'balance');
}

sub analysis {
    collection(shift, 'analysis');
}

1;
