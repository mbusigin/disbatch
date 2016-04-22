### This documents the differences in Disbatch 4 compared to Disbatch 3.

#### Goals achieved with rewrite:
- No more memory leak in main process.
- No more locked up event bus via unix sockets (uses MongoDB to pass all data).
- Can stop/restart disbatchd process any time without affecting running tasks.
- Can update plugins at any time without restarting disbatchd.
- Independent web server.


#### Backwards compatibility concerns for existing deployments:
- Can replace v3 of Disbatch with v4 with likely no changes to the database, and
  minimal back-compatability changes to the plugin.
- Can run both v3 and v4 against the same unauthenticated database.
- CANNOT pass Perl data structures (only JSON is allowed) to `queue search` nor
  `queue tasks`. That was a horrible idea.
- The `Backfill` feature has been removed - a web server thread handles this
  (creating 100k tasks at once only took 12 seconds on my 13" rMBP).
- The `Preemptive` setting has been removed.
- The `enclosure` command has been removed.
- The main process, the web server, and the task runner all have their own
  permission models if using authentication instead of sharing one account.


#### Changes:
- To keep the code simple, as much as possible is by convention instead of
  config (collection names, node name, etc).
- No need to have a file in `etc/disbatch/disbatch.d/` to define a plugin.
- Only the `::Task` part of the plugin is needed. Its parent is unused.
- `bin/disbatchd` instead of `bin/disbatchd.pl`
- `etc/disbatch/config.json` instead of `etc/disbatch/disbatch.ini`
  - most config will go into the `config` collection.
- The `disbatch-log4perl.conf` file is no longer used (automatically generated
  settings, can be overwritten in the config file)
- Task `stdout` and `stderr` are now written to (mostly-compatible) GridFS
  documents.
- To define a queue, the type must already be used in another queue, or listed
  in `plugins` in the config


#### New:
- can limit a node to a maximum number of tasks to run (value goes in the
  `nodes` collection documents)
