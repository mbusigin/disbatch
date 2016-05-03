#### Using SSL with the REST API

##### Configuring

This will put the REST API and web interface on port 443 using SSL, as well as
create 301 redirects for ports 80 and 8080.

* Modify `/etc/disbatch/disbatch-web-init` to listen on `127.0.0.1:8080` to
  prevent other hosts from connecting without SSL.

* For a clean nginx deployment, copy `/etc/disbatch/nginx-default.conf-example`
  to `/etc/nginx/conf.d/default.conf`.

* Change the two instances of `disbatch01.example.com` to the host's FQDN, and
  change the paths for the certficate files in `ssl_certificate` and
  `ssl_certificate_key` to the appropriate values.

##### Using the CLI

To use the `disbatch.pl` CLI on the same server as nginx is running, no changes
are needed.

To use the CLI on another host, pass `--url https://$FQDN` and either
`--ssl_ca_file $ssl_ca_file` if using a private CA, or
`--disable_ssl_verification` to disable verification.

Alternately, if the process has read access to `/etc/disbatch/config.json`, it
can determine the proper SSL settings.



#### Using SSL with MongoDB

##### Configuring

This assumes you already have an SSL certificate.

* Add the following to `/etc/mongod.conf`, making sure the cert is owned by and
  only readable by the `mongod` process:

    sslMode=requireSSL

    sslPEMKeyFile=/etc/ssl/certs/mongodb-cert.pem	# set the correct path

* Restart `mongod`.

##### Connecting with the MongoDB shell

To connect using the `mongo` shell, you must include the `--ssl` option.

In addition, you must pass the Certificate Authority file for SSL with
`--sslCAFile` and use the fully qualified domain name:

    mongo --ssl --sslCAFile $PATH --host $FQDN $DATABASE

or:

    mongo --ssl --sslCAFile $PATH $FQDN/$DATABASE

To connect to `localhost` where the domain in your cert will not match, you can
instead pass `--sslAllowInvalidCertificates` and omit the host.

    mongo --ssl --sslAllowInvalidCertificates $DATABASE

##### Connecting with the MongoDB perl driver

In perl, you connect with the following:

    my $mongo = MongoDB->connect($fqdn, {ssl => {SSL_ca_file => $path}});

Or if connecting to `localhost`, with:

    my $mongo = MongoDB->connect("localhost", {ssl => {SSL_verify_mode => 0x00}});



#### Using Authentication with MongoDB

##### Configuring

* Create a key file for multiple `mongod` processes to auth against each other,
  making sure it is owned by and only readable by the `mongod` process:

    touch mongodb-keyfile
    chmod 600 mongodb-keyfile
    openssl rand -base64 741 > mongodb-keyfile
    # copy to desired location and change owner

* Add the following to `/etc/mongod.conf`:

    auth=true
    keyFile=/etc/mongodb-keyfile

* Restart `mongod`

* Create needed users

##### Connecting with the MongoDB shell

After connecting with the `mongo` shell, you can authenticate against the
authentication database via:

    use admin
    db.auth(user, password)

You can also also pass `mongo` the following options and the shell will prompt
for the password. `--authenticationDatabase` is only needed if the
authentication database is different from the database you want to use.

    mongo -u $USER -p --authenticationDatabase $AUTH_DB $HOST/$DATABASE

##### Connecting with the MongoDB perl driver

* In perl, connect with the following (`db_name` is the optional authentication
  database and defaults to `admin`):

    my $mongo = MongoDB->connect($host, {username => $username, password => $password, db_name => $auth_database});
