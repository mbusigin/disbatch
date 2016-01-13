#!/usr/bin/perl

use 5.12.0;
use warnings;

use Config::Any;
use Cwd qw/abs_path getcwd/;
use Data::Dumper;
use Getopt::Long;
use Module::Load;
use Pod::Usage;

my $ini_file;
my $ini_dir;
my $lib  = '';
my $base = '';
my $help = 0;
my $man  = 0;
my $dev  = 0;

GetOptions(
    'inifile=s' => \$ini_file,
    'inidir=s'  => \$ini_dir,
    'lib=s'     => \$lib,
    'base=s'    => \$base,
    'help|?'    => \$help,
    'man'       => \$man,
    'dev'       => \$dev,
);

pod2usage(1) if $help;
pod2usage(-verbose => 2) if $man;

$ini_file //= '/etc/disbatch/disbatch.ini';
$ini_dir  //= '/etc/disbatch/disbatch.d';

my @lib = split /,/, $lib;

die "Cannot use --dev and --base together\n" if $dev and $base;	# FATAL

$base = getcwd if $dev;

my $path = '';
if ($base) {
    $ini_file = "$base/$ini_file";
    $ini_dir  = "$base/$ini_dir";
    push @lib, "$base/lib" unless $dev;
    $path = abs_path __FILE__;
    if ($path !~ m%^/usr/bin/%) {
        $path =~ s|/[^/]+/[^/]+$||;
        push @lib, "$path/lib" if -d "$path/lib";
    } else {
        $path = '';
    }
}

die "\nIni file '$ini_file' not found.\n" unless -e $ini_file;	# FATAL

if (@lib) {
    load lib, @lib;
}

require Synacor::Disbatch::Engine;
require Synacor::Disbatch::Timer;
require Synacor::Disbatch::Queue;
require Synacor::Disbatch::HTTP;

opendir(my $dh, $ini_dir) or goto no_disbatch_d;
my @dfiles = grep { /\.ini$/ && -f "$ini_dir/$_" } readdir($dh);
closedir $dh;
map { $_ =~ s/^/$ini_dir\// } @dfiles;

unshift @dfiles, $ini_file;

no_disbatch_d:
my $all_configs = Config::Any->load_files({files => \@dfiles, flatten_to_hash => 1, use_ext => 1});
my $config = $all_configs->{$ini_file};
$config->{log4perl_conf} = "$base/$config->{log4perl_conf}";
$config->{log4perl_reload} = 0 + ($config->{log4perl_reload} // 300);
$config->{htdocs_base}   = $path;

my @pluginclasses;
my $ini_dir_qm = quotemeta $ini_dir;
for my $dfile (grep { /^$ini_dir_qm\// } keys %{$all_configs}) {
    $config->{plugins}{$dfile} = $all_configs->{$dfile};
    push @pluginclasses, $config->{plugins}{$dfile}{class} if $config->{plugins}{$dfile}{class} and !$config->{plugins}{$dfile}{disabled};
}
$config->{pluginclasses} = \@pluginclasses;

# Module::Reload::Selective->reload(@{$config->{pluginclasses}});

if (exists $config->{EventBus}) {
    no warnings 'once';
    $Pinscher::Core::EventBus::threadprefix = $config->{EventBus}{threadprefix} if exists $config->{EventBus}{threadprefix};
}

my $engine = Synacor::Disbatch::Engine->new($config);

for my $pluginclass (@pluginclasses) {
    load $pluginclass;
    $engine->logger->info('Loading plugin class: ' . $pluginclass);
    my $load_plugin = "use $pluginclass;\n" . "\$engine->register_queue_constructor( '$pluginclass', \\&" . $pluginclass . "::new );\n";
    eval $load_plugin;
}

if (exists $config->{activequeues}) {
    $engine->{activequeues} = [ split /,/, $config->{activequeues} ];
}

if (exists $config->{ignorequeues}) {
    $engine->{ignorequeues} = [ split /,/, $config->{ignorequeues} ];
}

if (exists $config->{parameterformat}) {
    if ($config->{parameterformat} eq 'json') {
        $engine->{parameterformat_write} = \&Synacor::Disbatch::Engine::json_write;
        $engine->{parameterformat_read}  = \&Synacor::Disbatch::Engine::json_read;
    } elsif ($config->{parameterformat} eq 'storable') {
        $engine->{parameterformat_write} = \&Synacor::Disbatch::Engine::storable_write;
        $engine->{parameterformat_read}  = \&Synacor::Disbatch::Engine::storable_read;
    }
} else {
    die "No parameterformat specified!  Valid: json, storable";	# FATAL
}

if (exists $config->{ctfquantum}) {
    $engine->{ctfquantum} = $config->{ctfquantum};
} else {
    $engine->{ctfquantum} = 0.3;
}

$engine->logger->trace('Loading queues');
$engine->load_queues;
$engine->logger->trace('Loaded queues, starting schedulers');

my $timer = Synacor::Disbatch::Timer->new($config->{schedulertimerinterval}, sub { $engine->{eb}->call_thread('awaken') });

my $timer2 = Synacor::Disbatch::Timer->new($config->{updatetimerinterval}, sub { $engine->{eb}->call_thread('update_node_status') });

$engine->logger->trace('Spinning up HTTP service');
my $http = Synacor::Disbatch::HTTP->new($config->{httpport});

$http->start;
$timer->start;
$timer2->start;

$engine->logger->trace('Starting queue thread pools');
for my $queue (@{$engine->{queues}}) {
    $queue->start_thread_pool;
}
$engine->logger->trace('Updating node status for the first time');
$engine->update_node_status;
$SIG{__DIE__} = \&afterlife;

use POSIX ":sys_wait_h";

sub REAPER {
    my $stiff;
    while (($stiff = waitpid(-1, &WNOHANG)) > 0) {
    }
    $SIG{CHLD} = \&REAPER;    # install *after* calling waitpid
}

$SIG{CHLD} = \&REAPER;

# make sure disbatch children die as well:
$SIG{KILL} = sub { exit 137 };    # this worked in simple test script, but not here.
$SIG{TERM} = sub { exit 143 };
$SIG{HUP}  = sub { exit 129 };

#END { kill 'TERM', -$$; }

END {
    say "END block";
    if ($?) {
        say "*** we got a non-zero exit status, killing everything.";
        $http->kill;
        $timer->kill;
        $timer2->kill;
        for my $queue (@{$engine->{queues}}) {
            $_->kill for @{$queue->{threads}};
        }
    } else {
        # only Synacor::Disbatch::WorkerThread exits with 0
        # this only happens if tasks_before_workerthread_retirement != 0
        say "*** Synacor::Disbatch::WorkerThread exited.";
    }
}

$engine->logger->info('Initialisation complete');
while (1) {
    for my $queue (@{$engine->{queues}}) {
        $queue->start_thread_pool;
    }

    ## TODO: Remove this functionality
    if ($engine->{reloadqueues} == 1) {
        eval {
            $engine->logger->info('Reloading queues');
            $engine->{reloadqueues} = 0;
            $engine->{queues}       = [];
            Module::Reload::Selective->reload(@{$config->{pluginclasses}});
            $engine->load_queues;
        };
    }

    $engine->{eb}->oneiteration;
}

sub afterlife {
    $engine->logger->error(Dumper @_);
}

__END__

=head1 NAME

Disbatch - Distributed Batch

=head1 OVERVIEW

A tool for doing large distributed batch processing jobs, such as
mass-migrating email, calendars & contacts in a concurrent, well documenting
transacted, flexible and extensible way.

It is particularly suited for performing very large operations (tens or
hundreds of thousands), pausing, and re-starting from a stopped state.

=head1 OPTIONS

=over 2

=item --inifile

Name of ini file to use instead of C<disbatch.ini>. Include the path if not using C<--base>.

=item --inidir

Name of ini directory to use instead of C<disbatch.d>. Include the path if not using C<--base>.

=item --lib

Additional perl lib directories to load. If more than one, separate with a comma (C<,>).

=item --base

Takes a value that is the base directory for ini file and directory, as well as adds C<$base/lib> to included lib directories.
Also includes C<$path/lib> where C<$path> is the directory below the directory of this file, if this file is not in C</usr/bin>,
and passes C<$path> to the HTTP server to prepend the document root. This allows running C<disbatchd.pl> uninstalled.

=item --dev

Basically does what C<--base does>, but is a boolean, using the cwd. However, it does not add C<$base/lib>; instead you should do

  export PERL5LIB="$PWD/lib"

=item --help

Shows usage and options.

=item --man

Shows all documentation.

=back

