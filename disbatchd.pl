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
use Synacor::Disbatch::Input::Users;
use Synacor::Disbatch::Queue;
$Module::Reload::Selective::Options->{'ReloadOnlyIfEnvVarsSet'}  = 0;
Module::Reload::Selective->reload(qw(Synacor::Migration::Plugins::IMAP2IMAP Synacor::Migration::Plugins::Zimbra::ContactImport Synacor::Migration::Plugins::Zimbra::UserImport Synacor::Migration::Plugins::Zimbra::CalendarImport Synacor::Disbatch::Queue::Enclosure Synacor::Migration::Plugins::Qwest::UserCreate Synacor::Migration::Plugins::InsightPassword Synacor::Migration::Plugins::Tesco Synacor::Migration::Plugins::ABB));

use Synacor::Disbatch::HTTP;
use Config::Any;
use Data::Dumper;


print "\n\n\n";

my $config = Config::Any->load_files( { files => ['disbatch.ini'], flatten_to_hash => 1 } )->{ 'disbatch.ini' };

my $engine = Synacor::Disbatch::Engine->new( $config );
$engine->register_queue_constructor( 'Synacor::Migration::Plugins::IMAP2IMAP', \&Synacor::Migration::Plugins::IMAP2IMAP::new );
$engine->register_queue_constructor( 'Synacor::Migration::Plugins::Zimbra::ContactImport', \&Synacor::Migration::Plugins::Zimbra::ContactImport::new );
$engine->register_queue_constructor( 'Synacor::Migration::Plugins::Zimbra::UserImport', \&Synacor::Migration::Plugins::Zimbra::UserImport::new );
$engine->register_queue_constructor( 'Synacor::Migration::Plugins::Zimbra::CalendarImport', \&Synacor::Migration::Plugins::Zimbra::CalendarImport::new );
$engine->register_queue_constructor( 'Synacor::Disbatch::Queue::Enclosure', \&Synacor::Disbatch::Queue::Enclosure::new );
$engine->register_queue_constructor( 'Synacor::Migration::Plugins::Qwest::UserCreate', \&Synacor::Migration::Plugins::Qwest::UserCreate::new );
$engine->register_queue_constructor( 'Synacor::Migration::Plugins::InsightPassword', \&Synacor::Migration::Plugins::InsightPassword::new );
$engine->register_queue_constructor( 'Synacor::Migration::Plugins::Tesco', \&Synacor::Migration::Plugins::Tesco::new );
$engine->register_queue_constructor( 'Synacor::Migration::Plugins::ABB', \&Synacor::Migration::Plugins::ABB::new );

if ( exists($config->{'activequeues'}) )
{
    my @activequeues = split /,/, $config->{'activequeues'};
    $engine->{ 'activequeues' } = \@activequeues;
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

$engine->load_users;
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
          Module::Reload::Selective->reload(qw(Synacor::Migration::Plugins::IMAP2IMAP Synacor::Migration::Plugins::Zimbra::ContactImport Synacor::Migration::Plugins::Zimbra::UserImport Synacor::Migration::Plugins::Zimbra::CalendarImport Synacor::Disbatch::Queue::Enclosure Synacor::Migration::Plugins::Qwest::UserCreate Synacor::Migration::Plugins::InsightPassword Synacor::Migration::Plugins::Tesco Synacor::Migration::Plugins::ABB));
          $engine->load_queues;
      }
    }
    
    $engine->{'eb'}->oneiteration;
}


sub afterlife
{
    warn Dumper( @_ );
}
