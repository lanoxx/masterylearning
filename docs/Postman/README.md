# Postman Rest Endpoints

This folder contains the postman.json file which has all the definitions
of REST endpoints that the backend provides.

## Motivation

The reason for using Postman is because it provides a convenient
way of sending data to our backend in order to persist it into the
database. This can be useful to bootstrap the database when the
application is started for the first time on a fresh database, or
when we want to use the `create-drop` mode of hibernate which resets
the database tables each time the application is started.

## Useage

1. Install the Postman plugin via http://www.getpostman.com/
2. Import the `postman.json` configuration file into postman
3. You should now see a collection named `MasteryLearning` in the
side bar.

Open any of the endpoints and click send.

In generally you will want to start with the `Add Course` action to add
some course data to the database.
