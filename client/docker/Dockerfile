FROM nginx:stable
VOLUME /tmp
ADD nginx/default.conf /etc/nginx/conf.d/default.conf
RUN mkdir -p /var/www
ADD app /var/www
