#!/usr/bin/perl -W

=head1 NAME

Disbatch - Distributed Batch

=head1 OVERVIEW

A tool for doing large distributed batch processing jobs, such as
mass-migrating email, calendars & contacts in a concurrent, well documenting
transacted, flexible and extensible way.

It is particularly suited for performing very large operations (tens or
hundreds of thousands), pausing, and re-starting from a stopped state.

=cut



use strict;

use Module::Load;
use Data::Dumper;
use Config::Any;

use Synacor::Disbatch::Engine;
use Synacor::Disbatch::Timer;
use Synacor::Disbatch::Queue;
use Synacor::Disbatch::HTTP;


opendir( my $dh, 'disbatch.d' ) or goto no_disbatch_d;
my @dfiles = grep { /\.ini$/ && -f "disbatch.d/$_" } readdir($dh);
closedir $dh;
map { $_ =~ s/^/disbatch.d\//; } @dfiles;

unshift @dfiles, 'disbatch.ini';

no_disbatch_d:
my $all_configs = Config::Any->load_files( { files => \@dfiles, flatten_to_hash => 1 } );
my $config = $all_configs->{ 'disbatch.ini' };
my @pluginclasses;
foreach my $dfile ( grep {/^disbatch.d\//} keys %{$all_configs} )
{
  $config->{ 'plugins' }->{ $dfile } = $all_configs->{ $dfile };
  push @pluginclasses, $config->{ 'plugins' }->{ $dfile }->{'class'} if $config->{ 'plugins' }->{ $dfile }->{'class'} and !$config->{ 'plugins' }->{ $dfile }->{ 'disabled' };
}
$config->{'pluginclasses'} = \@pluginclasses;

# Module::Reload::Selective->reload(@{$config->{'pluginclasses'}});

if ( exists($config->{EventBus}) )
{
    $Pinscher::Core::EventBus::ebid = $config->{EventBus}->{ebid} if exists($config->{EventBus}->{ebid}); 
    $Pinscher::Core::EventBus::ipckey1 = $config->{EventBus}->{ipckey1} if exists($config->{EventBus}->{ipckey1}); 
    $Pinscher::Core::EventBus::ipckey2 = $config->{EventBus}->{ipckey2} if exists($config->{EventBus}->{ipckey2}); 
    $Pinscher::Core::EventBus::threadprefix = $config->{EventBus}->{threadprefix} if exists($config->{EventBus}->{threadprefix}); 
}

my $engine = Synacor::Disbatch::Engine->new( $config );

foreach my $pluginclass (@pluginclasses)
{
    load $pluginclass;
    $engine->logger->info( 'Loading plugin class: ' . $pluginclass );
    my $load_plugin = 
      "use $pluginclass;\n" .
      "\$engine->register_queue_constructor( '$pluginclass', \\&" . $pluginclass . "::new );\n";
    eval $load_plugin;
}


if ( exists($config->{'activequeues'}) )
{
    my @activequeues = split /,/, $config->{'activequeues'};
    $engine->{ 'activequeues' } = \@activequeues;
}

if ( exists($config->{'ignorequeues'}) )
{
    my @ignorequeues = split /,/, $config->{'ignorequeues'};
    $engine->{ 'ignorequeues' } = \@ignorequeues;
}


if ( exists($config->{'parameterformat'}) )
{
    if ( $config->{'parameterformat'} eq 'json' )
    {
        $engine->{ 'parameterformat_write' } = \&Synacor::Disbatch::Engine::json_write;
        $engine->{ 'parameterformat_read' } = \&Synacor::Disbatch::Engine::json_read;
    }
    elsif ( $config->{'parameterformat'} eq 'storable' )
    {
        $engine->{ 'parameterformat_write' } = \&Synacor::Disbatch::Engine::storable_write;
        $engine->{ 'parameterformat_read' } = \&Synacor::Disbatch::Engine::storable_read;
    }
}
else
{
    die "No parameterformat specified!  Valid: json, storable";
}

if ( exists($config->{'ctfquantum'}) )
{
    $engine->{'ctfquantum'} = $config->{'ctfquantum'};
}
else
{
    $engine->{'ctfquantum'} = 0.3;
}

$engine->logger->trace( 'Loading queues' );
$engine->load_queues;
$engine->logger->trace( 'Loaded queues, starting schedulers' );

my $timer = Synacor::Disbatch::Timer->new( $config->{'schedulertimerinterval'},
                                 sub
                                 {
                                     $engine->{'eb'}->awaken;
                                 }
                               );

my $timer2 = Synacor::Disbatch::Timer->new( $config->{'updatetimerinterval'},
                                 sub
                                 {
                                     $engine->{'eb'}->update_node_status;
                                 }
                               );

$engine->logger->trace( 'Spinning up HTTP service' );
my $http = Synacor::Disbatch::HTTP->new( $config->{'httpport'} );

$http->start;
$timer->start;                               
$timer2->start;


$engine->logger->trace( 'Starting queue thread pools' );
foreach my $queue ( @{$engine->{'queues'}} )
{
    $queue->start_thread_pool;
}
$engine->logger->trace( 'Updating node status for the first time' );
$engine->update_node_status;
$SIG{__DIE__} = \&afterlife;

use POSIX ":sys_wait_h";

sub REAPER {
    my $stiff;
    while (($stiff = waitpid(-1, &WNOHANG)) > 0) {
    }
    $SIG{CHLD} = \&REAPER;                  # install *after* calling waitpid
}

$SIG{CHLD} = \&REAPER;


$engine->logger->info( 'Initialisation complete' );
while( 1 )
{
    foreach my $queue ( @{$engine->{'queues'}} )
    {
        $queue->start_thread_pool;
    }

    ## TODO: Remove this functionality
    if ( $engine->{'reloadqueues'} == 1 )
    {
      eval
      {
          $engine->logger->info( 'Reloading queues' );
          $engine->{ 'reloadqueues' } = 0;
          $engine->{ 'queues' } = [];
          Module::Reload::Selective->reload(@{$config->{'pluginclasses'}});
          $engine->load_queues;
      }
    }
    
    $engine->{'eb'}->oneiteration;
}


sub afterlife
{
    $engine->logger->error( Dumper(@_) );
}
