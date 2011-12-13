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
use Proc::Daemon;
use Module::Reload::Selective; 
use Synacor::Disbatch::Engine;
use Synacor::Disbatch::Timer;
use Synacor::Disbatch::Queue;
$Module::Reload::Selective::Options->{'ReloadOnlyIfEnvVarsSet'}  = 0;

use Synacor::Disbatch::HTTP;
use Config::Any;
use Data::Dumper;


print "\n\n\n";

opendir( my $dh, 'disbatch.d' ) or goto no_disbatch_d;
my @dfiles = grep { /\.ini$/ && -f "disbatch.d/$_" } readdir($dh);
closedir $dh;
map { $_ =~ s/^/disbatch.d\//; } @dfiles;

unshift @dfiles, 'disbatch.ini';
warn Dumper( \@dfiles );

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

Module::Reload::Selective->reload(@{$config->{'pluginclasses'}});

my $engine = Synacor::Disbatch::Engine->new( $config );

print Dumper( \@pluginclasses );
foreach my $pluginclass (@pluginclasses)
{
    my $load_plugin = 
      "use $pluginclass;\n" .
      "\$engine->register_queue_constructor( '$pluginclass', \\&" . $pluginclass . "::new );\n";
    print $load_plugin . "\n";
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

$engine->load_queues;
warn "loaded queues";

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

my $http = Synacor::Disbatch::HTTP->new( $config->{'httpport'} );

$http->start;
$timer->start;                               
$timer2->start;



foreach my $queue ( @{$engine->{'queues'}} )
{
    $queue->start_thread_pool;
}
$engine->update_node_status;
$SIG{__DIE__} = \&afterlife;

warn "OK, here we go...\n";
while( 1 )
{
    foreach my $queue ( @{$engine->{'queues'}} )
    {
        $queue->start_thread_pool;
    }

    if ( $engine->{'reloadqueues'} == 1 )
    {
      eval
      {
          warn "Reloading queues!\n";
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
    warn Dumper( @_ );
}
