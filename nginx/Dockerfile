# Base on offical NGINX Alpine image
# FROM nginx:1.14.2-alpine
FROM jwilder/nginx-proxy:0.9

# Remove any existing config files
# RUN rm /etc/nginx/conf.d/*

# Copy config files
# *.conf files in conf.d/ dir get included in main config
# COPY ./default.conf /etc/nginx/conf.d/
COPY ./vhost.d/default /etc/nginx/vhost.d/default
COPY default.conf /etc/nginx/conf.d/custom.conf

# Expose the listening port
# EXPOSE 80

# Launch NGINX
# CMD [ "nginx", "-g", "daemon off;" ]