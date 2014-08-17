disbatch
========

Multi-language, elastic, distributed batch processing framework.

Disbatch is a multi-platform, multi-language elastic distributed batch processing framework. It heavily leverages MongoDB and JSON. The core components are MongoDB, N-number of DENs ([Disbatch Execution Nodes](https://raw.githubusercontent.com/mbusigin/disbatch/master/docs/DEN-spec-1.1.txt)), and potentially one or more DCNs (Disbatch Command Node).

#### Installing

0. `git clone https://github.com/mbusigin/disbatch.git`
0. `cd disbatch`
0. `make rpm`
0. `sudo yum install ~/rpmbuild/RPMS/noarch/disbatch-<VERSION>.noarch.rpm`

#### Configuring

0. `cp /etc/disbatch/disbatch.ini-example /etc/disbatch/disbatch.ini`
0. `$EDITOR /etc/disbatch/disbatch.ini`
  0. Change `mongohost` to the URI of your MongoDB servers.
  0. Change `mongodb` to the MongoDB database name you are using for  Disbatch.
  0. Maybe change `tasks_before_workerthread_retirement` from `1` to `0`?
  0. If running multiple Disbatch instances on the same machine:
    0. Uncomment and change the settings in `[EventBus]`
    0. Change `httpport`
0. Create an ini file in `/etc/disbatch/disbatch.d/` for every Disbatch task plugin:
  * `echo class=Synacor::Migration::Plugins::Foo > /etc/disbatch/disbatch.d/foo.ini`.
0. Create task plugins.
0. Make sure plugins are in lib path for Disbatch.
0. Create queues for plugins.
