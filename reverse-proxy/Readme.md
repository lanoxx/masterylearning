# About

The reverse-proxy module is responsible to handle incoming requests on port 80.
The following types of requests are handled:

 * Requests made by the LetsEncrypt server (e.g. CertBot Server) to the path
   `/.well-known`. These requests are served from `/var/www/letsencrypt`.
   See below for details on how this works.
 * All other requests are redirected to the HTTPS protocol and will
   be served by the client module.

# LetsEncrypt support

When LetsEncrypt is used to obtain SSL certificates for a domain, then
usually the `certbot` software will be running on the host. It needs
to generate the initial certificates and periodically
it will need to renew these certificates.

Certbot works by sending a request to the certbot server to request a certificate.
The certbot server then accesses a special path below  `${webroot-path}/.well-known`
to validate that the server on which the `certbot` runs is actually controlling
the domain for which a certificate was requested. 

Since these requests happen on port 80 the `reverse-proxy` module needs handle them
and should not redirect such requests to the HTTPS protocol. The `certbot` which runs
outside the `reverse-proxy` container needs to place the ACME challenge into
a folder which is served by the `reverse-proxy` module for requests to `/.well-known`.

Usually the `certbot` would be started with `--webroot -w /tmp/certbot`, for example:  

    sudo certbot certonly --webroot -w /tmp/certbot -d example.com

The `-w` option tells certbot to place files into `/tmp/certbot`, this folder
needs to be mounted via the volume option into the container at `/var/www/letsencrypt`.
This way the certbot server will see the ACME challenge of the `certbot` and can
validate certificate requests.
