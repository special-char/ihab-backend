# Base on offical NGINX Alpine image
FROM nginx:alpine
# FROM jwilder/nginx-proxy:0.9

# Remove any existing config files
# RUN rm /etc/nginx/conf.d/*
RUN addgroup -g 1000 -S www-data \
 && adduser -u 1000 -D -S -G www-data www-data
# Copy config files
# *.conf files in conf.d/ dir get included in main config
COPY ./nginx.conf /etc/nginx/nginx.conf
# COPY ./conf.d/default /etc/nginx/vhost.d/default
# COPY default.conf /etc/nginx/conf.d/custom.conf

# Expose the listening port
EXPOSE 80
EXPOSE 443

# Launch NGINX
CMD [ "nginx", "-g", "daemon off;" ]