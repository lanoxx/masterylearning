FROM java:8
VOLUME /tmp
ADD main.backend-0.1.jar app.jar
RUN bash -c 'touch /app.jar'
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-Dspring.datasource.url=jdbc:mysql://mysql/masterylearning","-jar","/app.jar"]
