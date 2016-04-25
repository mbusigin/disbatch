### This documents upgrading from Disbatch 3 to Disbatch 4.


#### Preliminary steps

- Rename the tasks and queues collections to `tasks` and `queues` if they have
  different names
- If there is already a collection `config`, rename it to something else


#### Configure

See [Configuring](/docs/Configuring.md)

Consult `/etc/disbatch/disbatch.ini` for reference of current settings.


#### Modify your plugins:

- To support only Disbatch 4:
  - Remove these lines:

            use Synacor::Disbatch::Task;
            use Synacor::Disbatch::Engine;
            our @ISA=qw(Synacor::Disbatch::Task);

  - Modify `new()`:

    The plugin was formerly instantiated as `new($queue, $parameters)`, and is
    now instantiated as `new(workerthread => $workerthread, task => $doc)`.

    See [Example `new()`](example-new) below.
  - Remove any `$Synacor::Disbatch::Engine::EventBus` call (namely,
    `report_task_done`).

    **Any other `EventBus` usage will no longer work.**
  - Finally, the task must return this when finished:

            {status => $status, stdout => $stdout, stderr => $stderr};

- To support both Disbatch 3 and Disbatch 4:
  - Replace these lines:

            use Synacor::Disbatch::Task;
            use Synacor::Disbatch::Engine;
            our @ISA=qw(Synacor::Disbatch::Task);

  - with the following:

            warn "Synacor::Disbatch::Task not found\n"
                unless eval 'use base "Synacor::Disbatch::Task"; 1';
            warn "Synacor::Disbatch::Engine not found\n"
                unless eval 'use Synacor::Disbatch::Engine; 1';

  - or if you don't care for the warnings if they aren't installed:

            eval 'use base "Synacor::Disbatch::Task"';
            eval 'use Synacor::Disbatch::Engine';

  - Modify `new()`:

    The plugin was formerly instantiated as `new($queue, $parameters)`, and is
    now instantiated as `new(workerthread => $workerthread, task => $doc)`.

    See [Example `new()`](example-new) below.
  - Append to any `$Synacor::Disbatch::Engine::EventBus` call (namely,
    `report_task_done`):

            if defined $Synacor::Disbatch::Engine::EventBus;

    **Any other `EventBus` usage will no longer work.**
  - Finally, the task must return this when finished:

            {status => $status, stdout => $stdout, stderr => $stderr};

#### Example `new()`

Disbatch 3 was called via `new($queue, $parameters)`, with `$queue` containing
`{id => $queue_id}` and `$parameters` containing the task's parameters.

Disbatch 4 is called via `new(workerthread => $workerthread, task => $doc)`,
with `$workerthread` being a `Disbatch` object using the `plugin` MongoDB user
and role, and `$doc` being the task's document from MongoDB.

The below is from `lib/Disbatch/Plugin/Demo.pm`.

    sub new {
        my $class = shift;

        # deprecated Disbatch 3 format
        if (ref $_[0]) {
            my ($queue, $parameters) = @_;
            warn Dumper $parameters;
            my %self = map { $_ => $parameters->{$_} } keys %$parameters;       # modifying $parameters breaks something in Disbatch 3.
            $self{queue_id} = $queue->{id};
            return bless \%self, $class;
        }

        my $self = { @_ };
        warn Dumper $self->{task}{parameters};

        # back-compat, so as to not change Disbatch 3 plugins so much
        # stick all params in $self
        for my $param (keys %{$self->{task}{parameters}}) {
            next if $param eq 'workerthread' or $param eq 'task';
            $self->{$param} = $self->{task}{parameters}{$param};
        }
        $self->{queue_id} = $self->{task}{queue};
        $self->{id} = $self->{task}{_id};

        bless $self, $class;
    }
