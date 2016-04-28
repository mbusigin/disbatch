disbatch
========
a scalable distributed batch processing framework


Disbatch 4 is a scalable distributed batch processing framework using MongoDB.
It runs on one-to-many nodes (servers), where each node handles hundreds to
thousands of concurrent tasks for one or more plugins.
Disbatch 4 can be updated and restarted as needed to deploy changes without
interrupting currently running tasks.

The Disbatch 4 daemon starts independent tasks using the specified plugin, and a
separate process provides the JSON API for the browser and CLI front ends.

This is almost a complete rewrite of Disbatch 3, written by Matt Busigin.

For an in-depth description of the design, see
[Design](docs/Design.md).


#### Installing

* From CPAN (not yet published):

        cpanm Disbatch

* From Git:

        git clone https://github.com/mbusigin/disbatch.git
        cd disbatch
        dzil build
        cpanm disbatch-<VERSION>.tar.gz


#### Configuring Disbatch 4

See [Configuring](docs/Configuring.md)


#### Creating task plugins

See [Plugins](docs/Plugins.md)


#### Running Disbatch 4

See [Running](docs/Running.md)


#### Changes from Disbatch 3

See [Differences](docs/Differences.md)


#### Upgrading from Disbatch 3

See [Upgrading](docs/Upgrading.md)


#### Authors

Ashley Willis (<awillis@synacor.com>)

Matt Busigin


#### Copyright and License

This software is Copyright (c) 2016 by Ashley Willis.

This is free software, licensed under:

> The Apache License, Version 2.0, January 2004
