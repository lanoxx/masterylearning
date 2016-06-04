FROM nginx:stable
VOLUME /tmp
ADD nginx/default.conf /etc/nginx/conf.d/default.template
RUN mkdir -p /var/www
ADD app /var/www
# Set a default value for our nginx configuration in case the user does not override this
# with `--env` when the container is started.
ENV NGINX_HOST localhost
RUN /bin/bash -c "envsubst < /etc/nginx/conf.d/default.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
