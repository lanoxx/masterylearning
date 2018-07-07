# Database Migrations

This folder contains the SQL scripts which are being used by Flyway to migrate the database schema to newer versions.
Each file must follow the Flyway naming convention which starts with an upper case V followed by a version number
then two underscores and then a description (e.g. `V#__<description>.sql`), where `#` is a number and `<description>`
is the description. The description will be stored in the schema migration table managed by Flyway.

## Creating Migration Scripts

In order to create new migration scripts the developer needs to identify how changes to the Hibernate Entities
translate to the database schema and then create a corresponding SQL script. This translation is a manual
process that the developer needs to perform. To make this translation easier it is helpful to
export the database schema generation script from Hibernate, to do this, use the following
environment parameters when starting the backend service:

    spring.jpa.properties.javax.persistence.schema-generation.create-source=metadata
    spring.jpa.properties.javax.persistence.schema-generation.scripts.action=create
    spring.jpa.properties.javax.persistence.schema-generation.scripts.create-target=create.sql
    spring.flyway.enabled=false

When started the backend service creates a `create.sql` script and stores it in the working directory (which
usually is the project root). By comparing the new `create.sql` with the current database schema
you can then derive the necessary SQL migration commands.

Note that we are using MySQL for our database and database migration commands such as `ALTER TABLE` are
usually not transaction safe in MySQL, the changes should therefore be well tested before being
applied to the production database.
