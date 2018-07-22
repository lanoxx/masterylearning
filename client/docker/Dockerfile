FROM nginx:stable
VOLUME /tmp
ADD nginx/ssl/default.template /etc/nginx/conf.d/default.template
RUN mkdir -p /var/www
ADD dist /var/www
# Set a default value for our nginx configuration in case the user does not override this
# with `--env` when the container is started.
ENV NGINX_HOST localhost
ENTRYPOINT ["/bin/bash", "-c", "envsubst '$NGINX_HOST' < /etc/nginx/conf.d/default.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
