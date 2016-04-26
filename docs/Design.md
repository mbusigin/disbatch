This document outlines the protocol which a Disbatch Execution Node (DEN) must
follow to correctly operate with Disbatch Command Nodes (DCN), as well as other
DENs operating under the same network/database.

#### Overview

Disbatch 4 uses MongoDB as its data store and for all message passing.

The core components are MongoDB, N-number of DENs (Disbatch Execution Nodes),
and potentially one or more DCNs (Disbatch Command Node).

Each Disbatch database can have one or more queues. These queues can be shared
by all nodes, or limited to specific nodes.

Each queue uses a specific Disbatch plugin for all tasks.

If the plugin listed for a queue is not available, the queue is ignored.

#### Mechanics

Each DEN is partitioned into queues. Each queue contains a pool of threads,
which are limited by the `maxthreads` queue parameter on a per-node basis.

On DEN startup, the node ensures required indexes, registers itself, and
processes the queues.

#### Task Lifecycle

A task is first created, generally on a DCN, either individually, or as a result
of a batch operation. Individual Tasks are saved to the `tasks` collection, with
a reference back to the queue (by ObjectId) it sits under. All tasks have a
number of attributes in common: `_id`, `ctime`, `mtime`, `queue`, `node`,
`parameters`, `status`, `stdout`, and `stderr`.

The mechanism for creating the tasks is up to the implementor of the DCN, or
even through some other mechanism. It is their job to create tasks to this
specification so that DENs may execute them, and a DCN can provide an interface
into the data.

A task is created, initialised with parameters, its status set to `-2`
(queued), and its node set to `-1` (unclaimed). Upon each Scheduling Interval,
every DEN will seek out these queued and unclaimed tasks, putting them into a
claimed state (status `-1`) up until the per-node and per-queue maximum thread
threshold (maxthreads) is reached.

When the DEN is ready, the task is actually put into the running status (`0`).
The plugin should not modify the task's document in MongoDB. When it has
finished, it should report back the status, stdout, and stderr of the task to
the DEN. The DEN then updates the task's document in MongoDB with these values.

 
#### Disbatch Execution Node Responsibilities

#### Requirements

Each DEN:

* MUST have a unique hostname, which is used to identify the node

* MUST register itself via the DEN Node Registration Protocol (nodes collection)

* MUST execute tasks via the DEN Task Execution Protocol


STARTUP & INITIALISATION

Before a DEN starts processing tasks, it is obligated to clean up any orphaned
tasks that were not put into a completed state by setting their status to `-6`.


#### Den Node Registration Protocol

#### Node Document Specification

Upon startup, each node must register itself to the `nodes` collection. The
following elements must be included:

* `node`: hostname (unique)

* `timestamp`: [ISODate](https://docs.mongodb.org/manual/core/shell-types/)

* `queues`: array of queue objects

It can also contain:

* `maxthreads`: a non-negative integer or null. If set to an integer, this
  entire node is limited to running that number of concurrent tasks across all
  queues.

MongoDB will create an `ObjectId` for the node's `_id`.


#### Queue Object

Each node's queue object must contain the following:

* `name`: a string to identify this queue (should be unique, but is not a
  requirement)

* `id`: a string representation of the queue's `_id` (example:
  `"571f8951b75bf335634ec271"`)

* `constructor`: the name of the plugin this queue uses (example:
  `"Disbatch::Plugin::Demo"`)

* `maxthreads`: a non-negative integer for the maximum number of threads per
  node for this queue, or null

* `tasks_todo`: a non-negative integer for the number of tasks queued (this
  queue's `count_todo` value minus any tasks in this queue with status `-1` or
  `0`)

* `tasks_doing`: a non-negative integer for the number of tasks in this queue
  with status `-1` or `0`

* `tasks_done`: a non-negative integer for the tasks done (this queue's
  `count_total` value minus this queue's `count_todo` value)

For legacy reasons, it also includes `preemptive` set to `1` and
`tasks_backfill` set to `0`.


#### Node Document Example

    {
        "_id" : ObjectId("56fc05087aa3a33942e42a6a"),
        "node" : "mig01.example.com",
        "timestamp" : ISODate("2016-04-26T19:26:33.649Z"),
        "queues" : [
            {
                "maxthreads" : 0,
                "constructor" : "Disbatch::Plugin::Demo",
                "name" : "demo",
                "tasks_doing" : 0,
                "tasks_done" : 0,
                "preemptive" : 1,
                "id" : "571f8951b75bf335634ec271",
                "tasks_todo" : 0,
                "tasks_backfill" : 0
            }
        ],
        "maxthreads": 5,
    }


#### Queue Document Specification

The following elements must be included when creating a queue:

* `name`: a string to identify this queue (should be unique, but is not a
  requirement)

* `constructor`: the name of the plugin this queue uses (example:
  `"Disbatch::Plugin::Demo"`)

The following elements may be included when creating a queue:

* `maxthreads`: a non-negative integer for the maximum number of threads per
  node for this queue, or null

* `sort`: a string on how to sort the query results when looking for the next
  task to run. Valid options are `fifo`, `lifo`, or `default`. The sort is on
  the tasks' `_id` values. If not used, the default order of the query returned
  by MongoDB will be used.


The following elements should be created by the DEN automatically when they are
`null` or missing, and should be managed by the DEN as tasks are created and
complete:

* `count_todo`: a non-negative integer for the number of tasks in this queue
  with a status less than or equal to `0`

* `count_total`: a non-negative integer for the total number of tasks in this
  queue

MongoDB will create an `ObjectId` for the queue's `_id`.


#### Queue Document Example

    {
        "_id" : ObjectId("571f8951b75bf335634ec271"),
        "constructor" : "Disbatch::Plugin::Demo",
        "name" : "demo",
        "count_total" : 0,
        "count_todo" : 0,
        "maxthreads" : 0,
        "sort" : "fifo"
    }

FIXME: MOVE THIS AND UPDATE IT for `activequeues` and `ignorequeues`
The `nodes_pin` and `nodes_ignore` attributes are mutually exclusive. If using
pin, it is exclusive to the specified nodes. If using ignore, it will run on all
nodes except for those specified. If both are erroneously provided, nodes_pin
takes precedence over nodes_ignore.


#### Task Document Specification

The following elements must be included when creating a task:

* `queue`: an `ObjectId` of the queue's `_id`

* `ctime`: an `ISODate` of the creation time

* `mtime`: an `ISODate` of the modification time

* `node`: the node this task is running or ran on, or `-1` if queued

* `status`: an integer for the task status code

* `parameters`: an object describing the unique qualities of this task (user,
  commands, etc)

The following elements should be created by the DEN when the task finishes, and
should be set to `null` when created:

* `stdout`: task output as a string or the GridFS file's `ObjectId`, or null

* `stderr`: task errors as a string or the GridFS file's `ObjectId`, or null

MongoDB will create an `ObjectId` for the task's `_id`.


#### Task Document Example

{
        "_id" : ObjectId("571fac85ee63413233049fbd"),
        "parameters" : {
                "migration" : "oneoff",
                "user1" : "ashley@example.com",
                "user2" : "ashley@example.com",
                "commands" : "*",
        },
        "ctime" : ISODate("2016-04-26T17:59:33Z"),
        "status" : 1,
        "mtime" : ISODate("2016-04-26T18:37:40Z"),
        "queue" : ObjectId("54a700074b485f0b00000000"),
        "node" : "mig01.example.com",
        "stderr" : ObjectId("571fbac9d8590b78fe4830b4"),
        "stdout" : ObjectId("571fbac9d8590b78fe4830b2")
}


#### Task Status Codes

These are the standard status codes in Disbatch 4:

* `-6`: Orphaned

  A task that was being worked on, but there was a disruption that was unrecoverable

* `-2`: Queued

  A task that has yet to be processed

* `-1`: Claimed

  A task claimed by a DEN but has yet to start (within ms)

* `0`: Running

  A task that is being worked on

* `1`: Succeeded

  A task that completed

* `2`: Failed

  A task that wasn't 100% completed due to an error

Formerly defined status codes that may be used for other needs:

* `-5`: Cancelled

* `-4`: Blocked

* `-3`: Terminated

You may use additional integer values for status codes. As a postive integer
indicates that a task has finished, your plugin must return a positive integer
for the status. Any unused negative value may be set when a task is queued to
prevent the DEN from claiming it, but it will still be counted in `count_todo`.

#### Task Lifecycle

Each task is initialised with its node as `-1` (unclaimed) and status as `-2`
(queued).

DENs claim tasks from a queue using `findOneAndUpdate(filter, update, options)`,
returning the task object.

* filter: { node: -1, status: -2, queue: $queue->{_id} }
* update: { $set: {node: this.node, status: -1, mtime: ISODate()} }
* options: { sort: { _id: 1 } }

See your MongoDB driver's documentation on its implemenation of
`findOneAndUpdate()`. If it is not available, you can use `findAndModify()`.

This ensures that there will be no race conditions amongst DENs, even in a
sharded or replicated MongoDB cluster.

The DEN thread running a task may update any non-specification attributes while
it is being executed.

When the DEN thread has concluded the task, it must update the task document by
setting `status` to a postive integer, and by setting `stdout` and `stderr`.

FIXME: should `mtime` be updated at completion as well?
