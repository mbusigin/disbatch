## This documents configuring Disbatch 4.


### Configure `/etc/disbatch/config.json`
1. Copy `/etc/disbatch/config.json-example` to `/etc/disbatch/config.json`
2. Make sure that only the process running Disbatch can read and edit
   `/etc/disbatch/config.json`
3. Edit `/etc/disbatch/config.json`
   1. Change `mongohost` to the URI of your MongoDB servers
   2. Change `database` to the MongoDB database name you are using for Disbatch
   3. Change passwords in `auth` for the respective MongoDB users, or delete
      the field or set its value to `null` if not using MongoDB authentication
   4. Ensure proper SSL settings in `attributes`, or remove it if not using SSL
   5. Change `default_config` from `development` to `production`
   6. Change `web_root` from `etc/disbatch/htdocs/` to `/etc/disbatch/htdocs/`
   7. Set `activequeues` or `ignorequeues` per node if used


### Create MongoDB users for Disbatch if using authentication
- If your MongoDB `root` user has a different name, passs that to `--root_user`.
  If no users exist yet, also pass `--create_root`. See the perldoc for more
  info.

        disbatch-create-users --config /etc/disbatch/config.json --root_user root


### Setup the `config` collection (optional):
- this is done automatically if not defined: disbatchd creates 2 documents with
  labels `production` and `development`
- each document must have a unique `label`
- `production` will be set to active unless the config file has a
  `default_config` value of something else
- only one document in this collection can have `active` set to `true` (a unique
  and sparse index)
- the document can be changed while disbatchd is running, and even a different
  document can be set to active (but be careful because it searches for the
  active document every second)
