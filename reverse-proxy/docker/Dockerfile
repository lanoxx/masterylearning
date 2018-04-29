FROM nginx:stable
ADD nginx/default.template /etc/nginx/conf.d/default.template
ENV NGINX_HOST localhost
ENTRYPOINT ["/bin/bash", "-c", \
            "envsubst '$NGINX_HOST' < /etc/nginx/conf.d/default.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
