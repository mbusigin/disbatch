### Configuring and Using SSL with the Disbatch Command Interface

#### Configuring

This will run the Disbatch Command Interface on port 443 using SSL, as well as
create 301 redirects for ports 80 and 8080.

* Modify `/etc/disbatch/disbatch-web-init` to listen on `127.0.0.1:8080` to
  prevent other hosts from connecting without SSL.

* For a clean nginx deployment, copy `/etc/disbatch/nginx-default.conf-example`
  to `/etc/nginx/conf.d/default.conf`.

* Change the two instances of `disbatch01.example.com` to the host's FQDN, and
  change the paths for the certficate files in `ssl_certificate` and
  `ssl_certificate_key` to the appropriate values.

#### Using the CLI

To use the `disbatch.pl` CLI on the same server as nginx is running, no changes
are needed.

To use the CLI on another host, pass `--url https://$FQDN` and either
`--ssl_ca_file $ssl_ca_file` if using a private CA, or
`--disable_ssl_verification` to disable verification.

Alternately, if the process has read access to `/etc/disbatch/config.json`, it
can use the same SSL settings as MongoDB.
