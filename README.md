# About

This is a software for an e-learning application specifically designed
to target university students with a focus on mathematical content,
in particular (logic and model checking).

We currently already support rendering of mathematical content
through the KATEX library made by the Khan Academy folks.

This application is still under development and not all features have
been implemented yet.

# Testing, Building, Installing

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
