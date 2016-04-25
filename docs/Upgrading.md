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
# FIXME: note new new()
  - Remove these lines:

            use Synacor::Disbatch::Task;
            use Synacor::Disbatch::Engine;
            our @ISA=qw(Synacor::Disbatch::Task);
  - Remove any `$Synacor::Disbatch::Engine::EventBus` call (namely,
    `report_task_done`). **Any other `EventBus` usage will no longer work.**
  - Finally, the task must return this when finished:

            {status => $status, stdout => $stdout, stderr => $stderr};
- To support both Disbatch 3 and Disbatch 4:
# FIXME: note new new()
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
  - Append to any `$Synacor::Disbatch::Engine::EventBus` call (namely,
    `report_task_done`):

            if defined $Synacor::Disbatch::Engine::EventBus;
    **Any other `EventBus` usage will no longer work.**
  - Finally, the task must return this when finished:

            {status => $status, stdout => $stdout, stderr => $stderr};
