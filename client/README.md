# Client Documentation

This is the client module which contains the code for the website that is served to our end users.
Some might also call this the frontend of our application.

## Deployment

When this module is built with the install phase of Maven, then 
it will create two Docker images named `masterylearning/client`
and `masterylearning/client-plain`. The plain image was added in version
0.7 and does not require SSL certificates, it serves files on port
80, however it has no reverse-proxy configuration, so for development
and testing purposes a separate reverse-proxy needs to be started
on the development machine when the plain image is used.

Both Docker images are based on the **nginx** web server and include
the application files. Each image also works as reverse-proxy to forward
API requests which use the `/api/*` path to the backend module.

## Starting the web server:

During development you will need start a development web
server that can also work as a revese-proxy. The reverse proxies
responsibility is to forwards requests to be backend service.

To start the development web server run:

`npm start`

This will run the `ws` command from the `local-web-server` project
which serves the website and also acts as reverse-proxy.

# SSL support

The client module's Docker container requires SSL certificates,
usually these certificates will be acquired by the system administrator
and mounted into the client Docker container at runtime.

The location for SSL certificates inside the container is:

    /etc/letsencrypt/live/${NGINX_HOST}/

The environment variable `NGINX_HOST` must be set to the name of the domain
where the client module is being deployed.

In addition a certificate parameter file is needed. This file must be mounted
into the container at the following location: 

    /etc/ssl/certs/dhparam.pem

This file should be generated on the target host and mounted
into the container. To generate the file the following command
can be used:

    sudo openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048

# Additional Notes

I originally used the [AsciiMath][1] module from MathJax, but due to the asynchronous nature of MathJax
it was difficult to integrate it properly into the AngularJS $compile and $digest cycle. So I decided to
switch to [KaTex][2]. A comparison of the two can be found [on intmath.com][3].

[1]: http://asciimath.org/
[2]: https://github.com/Khan/KaTeX/blob/master/README.md
[3]: http://www.intmath.com/cg5/katex-mathjax-comparison.php?processor=MathJax

I still plan to enhance the [logging][4] in my application.

[4]: http://solutionoptimist.com/2013/10/07/enhance-angularjs-logging-using-decorators/

Evaluate [ui.router.extras][6] by Christopher Thielen

[6]: https://github.com/christopherthielen/ui-router-extras
