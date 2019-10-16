FROM nginx:1.17.4
MAINTAINER Denis <fanaticfiz@outlook.com>

COPY init/generate_ui_config.sh /opt
COPY init/nginx.conf /etc/nginx/conf.d
COPY dist/gis-portal /usr/share/nginx/html

EXPOSE 80

CMD /opt/generate_ui_config.sh && nginx -g 'daemon off;'
