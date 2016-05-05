### Design of Disbatch 4

This documents the Disbatch Execution Node (DEN) protocol and schema. All nodes
using the same MongoDB database must follow this, as well as the Disbatch Task
Runners (DTR) used by the DENs and any Disbatch Command Interfaces (DCI) using
the database.

#### Overview

The core components of Disbatch 4 are one or more DENs, the DTRs, one or more
DCIs, and MongoDB which is used as the data store and for all message passing.

The DEN ensures the database is set up correctly and runs the appropriate number
of tasks for each queue.

The DTR is called by the DEN when it claims a task. The DTR is responsible for
loading the plugin and running the task, as well as updating the task document
when the task completes.

The DCI provides a JSON REST API for the DENs, as well as a web browser
interface to the API. An additional CLI tool interacts with this API.


Each DEN monitors one or more queues, which may be restricted to a subset of
DENs, restricted from a subset of DENs, or available to all DENs.

Each queue uses a specific Disbatch plugin for its tasks. If the plugin listed
for a queue is not available, the queue is ignored. The queue sets the limit of
tasks to run across all DENs for that queue with the `threads` field.

A DEN may also limit the number of tasks to run overall on that DEN with the
`maxthreads` field in its `nodes` collection's document.

Each task links to a single queue.

On startup, each DEN:

* Optionally loads additional configuration information from the `config`
  collection

* Ensures the collections have the proper indexes

* Optionally validates that all plugins listed in defined queues have a proper
  name and can be used

At a set interval (1 second), each DEN:

* Updates or inserts a document for itself in the `nodes` collection

* Cleans up any orphaned tasks

* Processes each queue, starting tasks as needed

* Optionally revalidates that all plugins listed in defined queues have a proper
  name and can be used if needed

* Optionally reloads additional configuration information from the `config`
  collection

#### Orphaned Tasks

Before a DEN starts processing tasks, it must clean up any orphaned tasks that
were not put into a completed state by setting their status to `-6`. It can also
check for this periodically. A recommendation is checking for tasks with a
status of `-1` and an `mtime` of older than 5 minutes.


##### Task Lifecycle

Each task is initialised with its `node` as `null` (unclaimed) and `status` as
`-2` (queued).

DENs claim tasks from queues using `findOneAndUpdate(filter, update, options)`,
(which returns the task object), by putting them into a claimed state (setting
`status` to `-1` and `node` to the hostname of the DEN) until the per-DEN
`maxthreads` and per-queue `theads` thresholds are reached. The DEN then
notifies the DTR of the task, and the DTR puts the task into a running state
(setting `status` to `0`). When the plugin has finished, it reports back the
status, stdout, and stderr of the task to the DTR. The DTR then updates the
task's document in MongoDB with these values as well as the `mtime`.

###### `findOneAndUpdate(filter, update, options)`

* filter

        { node: null, status: -2, queue: queue._id }

  Where `queue._id` is an `ObjectId` of the desired queue

* update

        { $set: {node: this.node, status: -1, mtime: ISODate()} }

    Where `this.node` is the hostname

* options (example to get the oldest queued task)

        { sort: { _id: 1 } }

See your MongoDB driver's documentation on its implemenation of
`findOneAndUpdate()`. If it is not available, you can use `findAndModify()`.

This ensures that there will be no race conditions amongst DENs, even in a
sharded or replicated MongoDB cluster.


#### Database Collections

##### Nodes

DEN documents are in the `nodes` collection.

###### Specification

The following elements must be included when registering a DEN:

* `node`: hostname (unique)

* `timestamp`: [ISODate](https://docs.mongodb.org/manual/core/shell-types/)

Each node can also contain:

* `maxthreads`: a non-negative integer or null. If set to an integer, this
  entire DEN is limited to running that number of concurrent tasks across all
  queues.

MongoDB will create an `ObjectId` for the node's `_id`.

###### Example

    {
        "_id" : ObjectId("56fc05087aa3a33942e42a6a"),
        "node" : "mig01.example.com",
        "timestamp" : ISODate("2016-04-26T19:26:33.649Z"),
        "maxthreads": 5,
    }


##### Queues

Queue documents are in the `queues` collection.

###### Specification

The following elements must be included when creating a queue:

* `name`: a string to identify this queue (should be unique, but is not a
  requirement)

* `plugin`: the name of the plugin this queue uses (example:
  `"Disbatch::Plugin::Demo"`)

The following elements may be included when creating a queue:

* `threads`: a non-negative integer for the maximum number of threads across all
  DENs for this queue, or null

* `sort`: a string on how to sort the query results when looking for the next
  task to run. Valid options are `fifo`, `lifo`, or `default`. The sort is on
  the tasks' `_id` values. If not used, the default order of the query returned
  by MongoDB will be used.

MongoDB will create an `ObjectId` for the queue's `_id`.

###### Example

    {
        "_id" : ObjectId("571f8951b75bf335634ec271"),
        "plugin" : "Disbatch::Plugin::Demo",
        "name" : "demo",
        "threads" : 0,
        "sort" : "fifo"
    }


##### Tasks

Task documents are in the `tasks` collection.

###### Specification

The following elements must be included when creating a task:

* `queue`: an `ObjectId` of the queue's `_id`

* `ctime`: an `ISODate` of the creation time

* `mtime`: an `ISODate` of the modification time

* `node`: the DEN this task is running or ran on, or `null` if queued

* `status`: an integer for the task status code

* `params`: an object describing the unique qualities of this task (user,
  commands, etc)

The following elements should be created by the DEN when the task finishes, and
should be set to `null` when created:

* `stdout`: task output as a string or the GridFS file's `ObjectId`, or null

* `stderr`: task errors as a string or the GridFS file's `ObjectId`, or null

MongoDB will create an `ObjectId` for the task's `_id`.

###### Example

    {
        "_id" : ObjectId("571fac85ee63413233049fbd"),
        "params" : {
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

  A task claimed by a DEN but has yet to start (within ms). The `node` must also
  be set to the DEN's hostname for tasks with a claimed status.

* `0`: Running

  A task that is being worked on

* `1`: Succeeded

  A task that completed successfully

* `2`: Failed

  A task that completed, but part failed due to an error

Formerly defined status codes that may be used for other needs:

* `-5`: Cancelled

* `-4`: Blocked

* `-3`: Terminated

You may use additional integer values for status codes. As a postive integer
indicates that a task has finished, your plugin must return a positive integer
for the status. Any unused negative value may be set when a task is queued to
prevent the DEN from claiming it.







### FIXMEs

* FIXME: UPDATE IT for `activequeues` and `ignorequeues`:

  The `nodes_pin` and `nodes_ignore` attributes are mutually exclusive. If using
  pin, it is exclusive to the specified DENs. If using ignore, it will run on
  all DENs except for those specified. If both are erroneously provided,
  nodes_pin takes precedence over nodes_ignore.

* FIXME: custom GridFS info:

  Collections are `tasks.files` and `tasks.chunks`, written to ensure the data
  is of type `String` and not `BinData`. Each file contains `metadata: {
  task_id: ObjectId() }`, and the filenames are `stdout` or `stderr`.

* FIXME: define DTR, document DCI

collections:
config - log4perl, label, task_runner, active (plugins, web_root, activequeues, ignorequeues)
nodes - covered by `Node Document Specification`
queues - covered by `Queue Document Specification`
tasks - covered by `Task Document Specification`
tasks.files
tasks.chunks
