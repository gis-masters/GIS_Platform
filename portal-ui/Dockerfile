FROM 10.10.10.116:5000/nginx:1.20.2
LABEL MAINTAINER="zakaratcha <zakaratcha@ya.ru>"

COPY init/init_config.sh /opt
COPY init/nginx_http.conf /opt
COPY init/nginx_https.conf /opt
COPY dist/gis-portal /usr/share/nginx/html

EXPOSE 80 443

CMD /opt/init_config.sh && nginx -g 'daemon off;'
