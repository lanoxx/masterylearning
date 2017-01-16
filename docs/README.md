# Documentation

This folder contains the UML models for our data model. They can be opened
with [Umlet](http://www.umlet.com) (a free and open source UML editor).

The [Postman subfolder](Postman/README.md) contains the REST endpoint configurations
for Postman which can be used to manually access the REST endpoints of the backend.

# Continuous Integration

In order to setup a continuous integration environment create the following
docker containers:

First create a docker network which connects our continuous
integration related containers:

    docker network create ci

Also take a look at how [docker's embedded DNS server](https://docs.docker.com/engine/userguide/networking/configure-dns/) works.

Next create containers for **postgresql**, **redis**, **gitlab**
and **jenkins**.

    docker run --name ci-postgresql --net ci --net-alias=postgresql -d \
               --env 'DB_NAME=ci-gitlab' \
               --env 'DB_USER=gitlab' \
               --env 'DB_PASS=gitlab' \
               --volume /srv/docker/gitlab/postgresql:/var/lib/postgresql \
               sameersbn/postgresql:9.4-12

    docker run --name ci-redis --net ci --net-alias=redisio -d \
               --volume /srv/docker/gitlab/redis:/var/lib/redis \
               sameersbn/redis:latest

    docker run --name ci-gitlab -d  --net ci --net-alias=gitlab \
               --publish 10022:22 --publish 10080:80 \
               --env 'DB_HOST=ci-postgresql' \
               --env 'DB_NAME=ci-gitlab' \
               --env 'DB_USER=gitlab' \
               --env 'DB_PASS=gitlab' \
               --env 'REDIS_HOST=ci-redis' \
               --env 'GITLAB_PORT=10080' \
               --env 'GITLAB_SSH_PORT=10022' \
               --env 'GITLAB_SECRETS_DB_KEY_BASE=f27c6740-00b0-11e6-80ef-bfbf660e2570' \
               --volume /srv/docker/gitlab/gitlab:/home/git/data \
               sameersbn/gitlab:8.4.2

    docker run --name ci-jenkins --net ci --net-alias=jenkins -d -p 8081:8080 -p 50000:50000
               --volume /srv/docker/jenkins:/var/jenkins_home \
               jenkins

The above setup is based on a tutorial from [damagehead.com](https://www.damagehead.com/docker-gitlab/?PageSpeed=noscript)

Finally to run the backend's integration tests a mysql database should
be available:

    docker run --name ci-mysql --net ci --net-alias=mysql
               --env 'MYSQL_ROOT_PASSWORD=masterylearning'
               --env 'MYSQL_DATABASE=masterylearning'
               mysql

# Useful links

## Design of REST APIs

The following two links give a useful overview about the
design of RESTful APIs.

http://www.micheltriana.com/blog/2013/10/07/uri-design-rest-web-api
http://www.restapitutorial.com/lessons/restfulresourcenaming.html

## Email sending to recover password

The Spring framework has support for [Email sending][1].

http://www.baeldung.com/registration-verify-user-by-email
http://www.baeldung.com/spring-security-registration-i-forgot-my-password

[1]: http://docs.spring.io/spring/docs/4.2.5.RELEASE/spring-framework-reference/htmlsingle/#mail

# Separating unit tests and integration tests

http://g00glen00b.be/spring-boot-rest-assured/
http://calenlegaspi.blogspot.co.at/

# Maven Phase and Goal overview

http://stackoverflow.com/questions/1709625/maven-command-to-list-lifecycle-phases-along-with-bound-goals

# Setup ssl certificate in nginx

https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-14-04
