# About

This is the backend of this e-learning platform. It is a web-based
Spring Boot application and its main functionality is to provide
RESTful endpoint to be used by the frontend (client) application.

# Architecture

This project uses the core Spring Framework library and Spring Boot
for bootstrapping and configuration. Additionally the following
list gives an overview of the other dependencies used:

 * Spring Security for Basic authentication and securing of REST
   endpoints.
 * Spring Data JPA and Hibernate for persistence
 * Mysql JDBC driver to connect with MySQL
 * Log4j2 for logging

We also use the Spring Web MVC layer for our REST endpoints and Jackson
for data serialization.

This application is containerized for docker with the
`docker-maven-plugin`.

# Configuration and preparation

The default `datasource` configuration to find the mysql database
is stored in the `application.properties` file and can be overridden
by using the `-D` option when starting the executable `jar` file.

In order to run this application a mysql database must be installed
and the user configured by the `datasource` configuration must have
access to an existing database named `masterylearning`.

I use a docker mysql instance to run the database but it is also
possible to install mysql directly on the system. To create and
run a new docker container with mysql use the following command:

    docker network create mlnet

    docker run --name masterylearning-mysql --net mlnet --net-alias mysql -p 4000:3306 \
               --env MYSQL_ROOT_PASSWORD=masterylearning \
               --env MYSQL_DATABASE=masterylearning \
               -v /srv/masterylearning:/var/lib/mysql -d mysql:latest

If you use an alternative password instead of `masterylearning` you
should overwrite the password datasource option when starting the
backend. The above command also creates a default database named
`masterylearning`.

# Building and Deployment

To build this application you can run

    mvn package docker:build

This will install a docker image named `masterylearning/main.backend`
in your local docker registry. Additionally an executable jar file
has been build by maven and put in the `target/` directory.

You can either run the executable `jar`-file directly with the following
command

    java -jar target/main.backend-0.1.jar

or

    java -jar target/main.backend-0.1.jar -Dspring.datasource.foo=bar

if you need to override any of the default values in the
`application.properties` as explained above under configuration.
Replace `foo` and `bar` with the respective property name and value.

Alternatively you can create and start a new docker container:

    docker create --name masterylearning-backend --net mlnet --net-alias=backend -p 8080:8080 <imageId>

This has the following effect, the name for our new container is
`backend`, it is linked with an existing mysql container named `masterylearning-mysql`,
and the port 8080 from inside the container is mapped to the port
8080 on the host.

You can check if everything works by running

    docker logs <containerId>

The rest endpoints should now be available on the host through
`http://localhost:8080`.
