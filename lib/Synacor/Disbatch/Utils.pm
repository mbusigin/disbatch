package Synacor::Disbatch::Utils;

use 5.12.0;
use warnings;

use Carp;
use File::Slurp();
use JSON();

=head1 NAME

Synacor::Disbatch::Utils - currently just to load and validate the config for Synacor::Disbatch::MongoDB

=head1 SYNOPSIS

use Synacor::Disbatch::Utils;

my $utils = Synacor::Disbatch::Utils->new();

=head1 SUBROUTINES

=over 2

=item new

Returns a simple Synacor::Disbatch::Utils object.

=item load_json

Parameters: Name of relaxed JSON file to load.

Returns C<HASH> of decoded JSON. Dies if any error reading or decoding the file.

=item load_config

Parameters: name of config file, name of schema file for config file.

Loads a config file, validating that it has the proper fields defined according to the schema file.

Returns C<HASH> of decoded config file. Dies if any error reading or decoding the file, or it does not pass the schema test.

=cut

sub new {
    bless {};
}

sub load_json {
    my $self = shift;
    my $json_file = shift;
    my $json_txt = File::Slurp::slurp($json_file);
    my $json = JSON->new->relaxed->decode( $json_txt ) or die "Could not parse json file '$json_file': $!";
    return $json;
}

sub load_config {
    my ($self, $config_file, $schema_file) = @_;
    my $config = $self->load_json($config_file);
    my $schema = $self->load_json($schema_file);

    _validate_config($config, $schema);
    return $config;
}

sub _validate_config {
    my ($config, $schema) = @_;
    for my $client (keys %$config) {
        my $cfg = $config->{$client};
        for my $key (@$schema) {
            my $temp = $cfg;
            my @keys = split /\./, $key;
            my $last = pop @keys;
            $temp = $temp->{$_} for @keys;
            if ($last eq '%') {
                die "$key not defined for $client" unless defined $temp;
                die "$key not a HASH for $client" unless ref $temp eq 'HASH';
            } elsif ($last eq '@') {
                die "$key not defined for $client" unless defined $temp;
                die "$key not a ARRAY for $client" unless ref $temp eq 'ARRAY';
            } else {
                die "$key not defined for $client" unless defined $temp->{$last};
                die "$key value not a scalar for $client" if ref $temp->{$last};
            }
        }
    }
}

1;
