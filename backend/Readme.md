# Configuration

We are using spring-data-jpa with mysql (or postgresql).

So far I have done the following configuration:

 1. Added maven dependencies for spring-boot-jpa-data and mysql-connector-java
 2. In application.properties set the spring.datasource properties
 3. Setup a mysql database docker instance and manually created a database inside that
    instance.
 4. After starting the docker instance I used the mysql command to connect to
    the mysql inside the docker instance.

