package Disbatch::Roles;

use 5.12.0;
use warnings;

use Safe::Isa;
use Try::Tiny;

sub new {
    my $class = shift;
    my $self = { @_ };
    die "A MongoDB::Database object must be passed as 'db'" unless ref ($self->{db} // '') eq 'MongoDB::Database';
    die "Passwords for accounts must be passed as 'disbatchd', 'disbatch_web', and 'task_runner'" unless $self->{disbatchd} and $self->{disbatch_web} and $self->{task_runner};

    $self->{userroles} = {
        disbatchd => {
            password => $self->{disbatchd},
            privileges => [
                { resource => { db => $self->{db}{name}, collection => '' }, actions => [ 'find' ] },
                { resource => { db => $self->{db}{name}, collection => 'config' },  actions => [ 'insert', 'update', 'createCollection', 'createIndex' ] },
                { resource => { db => $self->{db}{name}, collection => 'nodes' },  actions => [ 'insert', 'update' ] },	# had to add insert
                { resource => { db => $self->{db}{name}, collection => 'queues' },  actions => [ 'update' ] },
                { resource => { db => $self->{db}{name}, collection => 'tasks' },  actions => [ 'update', 'createCollection', 'createIndex' ] },
                { resource => { db => $self->{db}{name}, collection => 'task_output.chunks' },  actions => [ 'createCollection', 'createIndex' ] },
                { resource => { db => $self->{db}{name}, collection => 'task_output.files' },  actions => [ 'createCollection', 'createIndex' ] },
            ],
        },
        disbatch_web => {
            password => $self->{disbatch_web},
            privileges => [
                { resource => { db => $self->{db}{name}, collection => '' }, actions => [ 'find' ] },
                { resource => { db => $self->{db}{name}, collection => 'queues' },  actions => [ 'insert', 'update', 'remove' ] },
                { resource => { db => $self->{db}{name}, collection => 'tasks' },  actions => [ 'insert' ] },
            ],
        },
        task_runner => {
            password => $self->{task_runner},
            privileges => [
                { resource => { db => $self->{db}{name}, collection => '' }, actions => [ 'find' ] },
                { resource => { db => $self->{db}{name}, collection => 'queues' },  actions => [ 'update' ] },
                { resource => { db => $self->{db}{name}, collection => 'tasks' },  actions => [ 'update' ] },
                { resource => { db => $self->{db}{name}, collection => 'task_output.chunks' },  actions => [ 'insert' ] },
                { resource => { db => $self->{db}{name}, collection => 'task_output.files' },  actions => [ 'insert' ] },
                { resource => { db => $self->{db}{name}, collection => 'users' },  actions => [ 'update' ] },
                { resource => { db => $self->{db}{name}, collection => 'reports' },  actions => [ 'insert' ] },
                { resource => { db => $self->{db}{name}, collection => 'complete' },  actions => [ 'update' ] },
                { resource => { db => $self->{db}{name}, collection => 'status' },  actions => [ 'update', 'createCollection', 'createIndex' ] },
                { resource => { db => $self->{db}{name}, collection => 'nodeQueues' },  actions => [ 'update' ] },
            ],
        },
    };
    bless $self, $class;
}

sub create_roles_and_users {
    my ($self) = @_;
    for my $name (keys %{$self->{userroles}}) {
        $self->{db}->run_command([createRole => $name, roles => [], privileges => $self->{userroles}{$name}{privileges} ]);
        $self->{db}->run_command([createUser => $name, pwd => $self->{userroles}{$name}{password}, roles => [ { role => $name, db => $self->{db}{name} } ]]);
    };
}

sub drop_roles_and_users {
    my ($self) = @_;
    for my $name (keys %{$self->{userroles}}) {
        try {
            $self->{db}->run_command([dropRole => $name]);
        } catch {
            # MongoDB::DatabaseError: No role named disbatch_web@disbatch
            if ($_->$_isa('MongoDB::DatabaseError') and $_->{message} =~ /^No role named $name\@$self->{db}{name}$/) {
                warn "$_->{message} (ignoring error)\n";
            } else {
                die $_;
            }
        };
        # User 'disbatch_web@disbatch' not found
        try {
            $self->{db}->run_command([dropUser => $name]);
        } catch {
            if ($_->$_isa('MongoDB::DatabaseError') and $_->{message} =~ /^User '$name\@$self->{db}{name}' not found$/) {
                warn "$_->{message} (ignoring error)\n";
            } else {
                die $_;
            }
        };
    };
}

1;

=encoding utf8

=head1 NAME

Disbatch::Roles – define and create MongoDB roles and users for Disbatch

=head1 SUBROUTINES

=over 2

=item new

Parameters: C<< db => $db, disbatchd => $disbatchd_pw, disbatch_web => $disbatch_web_pw, task_runner => $task_runner_pw >>

  C<db> is a C<MongoDB::Database> object which must be authenticated with an accout having the C<root> role.
  C<disbatchd>, C<disbatch_web>, and C<task_runner> are roles and users to create, with their values being their respective passwords.

Dies if invalid parameters.

=item create_roles_and_users

Parameters: none.

Creates the roles and users for C<disbatchd>, C<disbatch_web>, and C<task_runner>.

Dies if the roles or users already exist, or on any other MongoDB error.

=item drop_roles_and_users

Parameters: none.

Drops the roles and users for C<disbatchd>, C<disbatch_web>, and C<task_runner>.

Dies if the roles or users don't exist(???), or on any other MongoDB error.

=back

