# Interactive Lecture Notes

* [About](#about)
* [Modules](#modules)
* [Testing, Building, Installing](#testing-building-installing)
* [Deploying on AWS](#deploying-on-aws)

## About

This is a software for an e-learning application specifically designed
to target university students with a focus on mathematical content,
in particular (logic and model checking).

We currently already support rendering of mathematical content
through the KATEX library made by the Khan Academy folks.

This application is still under development and not all features have
been implemented yet.

## Modules

Additional information about this software can be found
in the individual modules as well as in the documentation:

* [Backend](backend/)
* [Client](client/)
* [Documentation](docs/)

The backend module handles access to the database
and offers REST endpoints for access to the data. The client module
contains all the code for the website that our end users will see.
The documentation contains additional information about this application,
including information about the data model and the REST endpoints.

## Testing, Building, Installing

To build with maven run the following command from the project root:

    mvn package

This will build and package the project including the child modules.
If you want to build the docker images for the application then
additionally run the install phase:

    mvn install

this will build docker images for all child modules.

Running the `install` phase includes the `verify` phase which runs
integration tests. Therefore a properly configured MySQL database
must be accessible. By default the tests look for a MySQL database
on `localhost` with port `4001`, and expect an existing database named
`masterylearning` that is accessible for user `root` with password
`masterylearning`. You can override with the `spring.datasource.url`
option:

```
   mvn install -Dspring.datasource.url=jdbc:mysql://<db__host>:<db__port>/<db_name>
```

Replace `<db_host>`, `<db_port>` and, `db_name` by your respective configuration.

## Deploying on AWS

This section explains how to push the docker images that were built in with Maven
to an AWS EC2 Container Registry (e.g. a docker registry). The following
steps assume that you have installed the `aws` command line tool. 

 1. You need to use the `aws` command to get a login command for docker:

        aws erc get-login

    This will output a `docker login` command with a very long password, that you can use to login
    with docker.

 2. Use `docker tag` to tag your images. This step is necessary to let the push command know which
 images to push:

        docker tag masterylearning/backend:latest <your_ec2registry>/masterylearning/backend
        docker tag masterylearning/client:latest <your_ec2registry>/masterylearning/client

 3. Finally use `docker push` to push your images into your docker registry:

        docker push <your_ec2registry>/masterylearning/backend
        docker push <your_ec2registry>/masterylearning/client
