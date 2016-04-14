FROM java:8
VOLUME /tmp
ADD main.backend-0.1.jar app.jar
RUN bash -c 'touch /app.jar'
ARG DB_HOST=mysql
ENV DB_HOST $DB_HOST
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-Dspring.datasource.url=jdbc:mysql://${DB_HOST}/masterylearning","-jar","/app.jar"]
