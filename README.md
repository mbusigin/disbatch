disbatch
========

Multi-language, elastic, distributed batch processing framework.

Disbatch is a multi-platform, multi-language elastic distributed batch
processing framework. It heavily leverages MongoDB and JSON. The core components
are MongoDB, N-number of DENs ([Disbatch Execution Nodes]
(https://raw.githubusercontent.com/mbusigin/disbatch/master/docs/DEN-spec-1.1.txt)),
and potentially one or more DCNs (Disbatch Command Node).

#### Installing

0. `git clone https://github.com/mbusigin/disbatch.git`
0. `cd disbatch`
0. `dzil build`
0. `cpanm disbatch-<VERSION>.tar.gz`

#### Configuring

0. `cp /etc/disbatch/disbatch.ini-example /etc/disbatch/disbatch.ini`
0. `cp /etc/disbatch/config.json-example /etc/disbatch/config.json`
0. Make sure that only the process running Disbatch can read and edit
   `/etc/disbatch/config.json`
0. `$EDITOR /etc/disbatch/config.json`
  0. Change `mongohost` to the URI of your MongoDB servers.
  0. Change `database` to the MongoDB database name you are using for Disbatch.
  0. Change passwords in `auth`.
  0. Ensure proper SSL settings in `attributes`.
  0. Change `default_config` to `production`.
0. Create task plugins.
0. Make sure plugins are in lib path for Disbatch.
0. Create queues for plugins.
