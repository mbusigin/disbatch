package Disbatch::Task;

use 5.12.0;
use warnings;

use Log::Log4perl;
use MongoDB;

sub new {
    my $class = shift;
    my $self = { @_ };
    $self->{class} //= 'Disbatch::Plugin::Task';
    $self->{class} = lc $self->{class};
    $self->{config}{log4perl} //= { level => 'TRACE', appenders => {
        screenlog => { type => 'Log::Log4perl::Appender::ScreenColoredLevels' },
        filelog => { type => 'Log::Log4perl::Appender::File', args => { filename => "/tmp/$self->{task_id}" } },
    } };
    bless $self, $class;
}

sub mongo { MongoDB->connect($_[0]->{config}{mongohost})->get_database($_[0]->{config}{mongodb}) }
sub nodes  { $_[0]->mongo->get_collection('nodes') }
sub queues { $_[0]->mongo->get_collection('queues') }
sub tasks  { $_[0]->mongo->get_collection('tasks') }

sub logger {
    my ($self, $type) = @_;
    my $logger = defined $type ? "$self->{class}.$type" : $self->{class};
    $self->{loggers}{$logger} //= Log::Log4perl->get_logger($logger);
    if (!keys %{Log::Log4perl->appenders}){
        $self->{loggers}{$logger}->level($self->{config}{log4perl}{level});
        my $default_layout = "[%p] %d %F{1} %L %C %c> %m %n";
        for my $name (keys %{$self->{config}{log4perl}{appenders}}) {
            my $ap = Log::Log4perl::Appender->new($self->{config}{log4perl}{appenders}{$name}{type}, name => $name, %{$self->{config}{log4perl}{appenders}{$name}{args}});
            $ap->layout(Log::Log4perl::Layout::PatternLayout->new($self->{config}{log4perl}{appenders}{$name}{layout} // $default_layout));
            $self->{loggers}{$logger}->add_appender($ap);
        }
    }
    $self->{loggers}{$logger};
}

1;
