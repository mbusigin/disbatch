package Synacor::Disbatch::Task;

use 5.12.0;
use warnings;

use Carp;
use Try::Tiny;

sub new { bless {}, shift }

sub run { ... }

sub workerthread {
    $_[0]->{workerthread} or confess "No workerthread defined";
    $_[0]->{workerthread};
}

1;

__END__

=head1 NAME

Synacor::Disbatch::Task - a single discrete task.  This is a base
class that is inherited, with run() overridden to do useful things like run
imapsync.

=head1 METHODS

=over 1

=item run()

Override this to implement the most atomic individual operation your task can perform.

