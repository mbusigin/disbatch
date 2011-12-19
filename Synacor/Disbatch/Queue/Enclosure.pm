package Synacor::Disbatch::Queue::Enclosure;

=head1 NAME

Synacor::Disbatch::Queue::Enclosure - queue which allows you to run arbitrary Perl expressions

=head1 METHODS

=over 1

=cut


use strict;
use threads;
use threads::shared;
use Synacor::Disbatch::Task;
use Data::Dumper;
use IPC::Open3;


our @ISA = qw( Synacor::Disbatch::Queue );

sub new
{
    my $class = shift;
    my $engine = shift;
    
    my $self = Synacor::Disbatch::Queue->new( 3 );
    $self->{ 'engine' } = $engine;
    bless $self, $class;
    return $self;
}


sub create_task_actual
{
    my $self = shift;
    my $data = shift;

    my $task = eval
    {

=back
=head1 NAME

Synacor::Disbatch::Queue::Enclosure::task - single Perl expression evaluation task

=cut

        package Synacor::Disbatch::Queue::Enclosure::Task;
        use strict;
        use threads;
        use threads::shared;
        use Synacor::Disbatch::Task;
        use Synacor::Disbatch::Engine;
        use IPC::Open3;
        use IO::Select;
        use IO::Socket;
        use IO::Handle;
        use Data::Dumper;
        
        
        our @ISA=qw(Synacor::Disbatch::Task);
        
        sub new
        {
            our @ISA=qw(Synacor::Disbatch::Task);
            my $class = shift;
            my $queue = shift;
            my $parameters = shift;
            my $perl = $parameters->{'perl'};
            
            my $self = Synacor::Disbatch::Task->new;
            
            $self->{ 'queue_id' } = $queue->{ 'id' };
            $self->{ 'perl' } = $perl;

            bless $self, $class;

#            warn "User1: " . $self{'user1'} . "\n";
            
            
            return $self;
        }
    
        sub run
        {
            my $self = shift;
            my ( $stdout, $stderr, $status ) = ( '<stdout>', '<stderr>', 1 );
            my $perl = $self->{ 'perl' };
            
            eval( $perl );
            if ( $@ )
            {
                $stdout .= "Error evaluating Perl expression: $@";
            }
                
            $Synacor::Disbatch::Engine::EventBus->report_task_done( $self->{'queue_id'}, $self->{'_id'}, $status, $stdout, $stderr );
            return;
        }
        __PACKAGE__;
    }->new( $self, $data );
    
    return $task;
}


sub parameters_definitions
{
    return
    {
        name =>
        {
            'name'		=> 'perl',
            'type'		=> 'string',
            'default'		=> 'warn "Hello, world!"',
            'description'	=> 'a Perl expression to evaluate',
        },
    };
}


sub queue_definitions
{
    return
    [
    ];
}


1;
