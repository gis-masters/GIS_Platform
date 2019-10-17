FROM nginx:1.17.4
MAINTAINER Denis <fanaticfiz@outlook.com>

COPY init/init_config.sh /opt
COPY init/nginx.conf /etc/nginx/conf.d
COPY dist/gis-portal /usr/share/nginx/html

EXPOSE 80

CMD /opt/init_config.sh && nginx -g 'daemon off;'
