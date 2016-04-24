### This documents writing plugins for Disbatch 4.

### FIXME: should probably make a fourth MongoDB user for the plugin.

#### Requirements

* Two subroutines: `new` and `run`

### FIXME: change to doing $task->new({workerthread => $disbatch, task => $doc})

  * new({$id => $queue_id}, $parameters)

    The first HASH contains only the key `id` with the value the `MongoDB::OID`
    object of the task's queue.

    The second hash is the task's `parameters` value, which should be a HASH.

  * run()

    This must return a HASH, and the HASH should contain the keys `status`,
    `stdout`, and `stderr`.

    The value of `status` must be a positive integer, where `1` indicates
    success, and generally `2` to indicate failure.  If not, it will be set as
    `2`.

    The values of `stdout` and `stderr` should be simple scalars (strings or
    `undef`), and will be forced to be strings.

* After `new` is called, `task_runner` will set `$plugin->{workerthread}` to the
  `Disbatch` object, and set `$plugin->{id}` to the task document's
  `MongoDB::OID` object.

* The plugin must be installed in the same Perl lib path as Disbatch and
  task_runner are.

#### Objects available to the plugin

* The task's parameters HASH, by convention the key/value pairs put directly
  into `$self`

* The task's queue id as a `MongoDB::OID` object, by convention put in
  `$self->{queue_id}`

* The tasks's id as a `MongoDB::OID` object in `$self->{id}`

* The task_runner's `Disbatch` object in `$self->{workerthread}`

  This gives access to the 'Disbatch' subroutines, such as `logger`, `mongo`,
  and the various collection helper subs (`nodes`, `queues`, `tasks`, `config`),
  with whatever MongoDB access permissions `task_runner` has, but it should not
  be modifying task documents.

#### Best Practices

* FIXME: commands, finish(), reports, accessing and updating other MongoDB collections
