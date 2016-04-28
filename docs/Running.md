### This documents running Disbatch 4.

* [Configure](Configuring.md) Disbatch before running

* Start, stop, restart

  * On each server you want Disbatch running:

            /etc/init.d/disbatchd [start|stop|restart]

  * On each server you want the Disbatch JSON API and web server running:

            /etc/init.d/disbatch-webd [start|stop|restart]

    This can run on the same servers as `disbatchd`, or on completely different
    ones.

* Web interface, by default running on port 8080

  * Create a new queue by clicking on `New Queue`, entering a `Name`, selecting
    a `Type` from the drop-down menu, and clicking `Create`.

  * Modify an existing queue by clicking on its `Type`, `Name`, or `Threads`.
    `Threads` is the number of concurrent tasks to run from this queue **per
    node**. You cannot delete a queue from the web interface.

  * To limit the total number of concurrent tasks to run per node, set `Max
    Threads` for that node in the `Nodes` table. This will take precedence over
    any queue `Threads` settings. To disable a node's `Max Threads` value,
    delete the value from the table. If you set it to `0`, no threads will run.

  * You can refresh the tables at any time by clicking on `Refresh`. They also
    refresh automatically every 60 seconds, and after any changes via the web
    interface.

* CLI

  * With `disbatch.pl`, you can list queues, create queues, modify max threads
    of queues, create a single task in a queue, create many tasks in a queue
    based off a filter from another collection, search for tasks in a queue, and
    list queue plugin types available.

  * For a full description, run `perldoc disbatch.pl`

  * If the JSON API is not running on `http://localhost:8080`, pass the URL with
    the `--url` option.
