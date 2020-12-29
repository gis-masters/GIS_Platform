FROM nginx:1.17.4

COPY init/init_config.sh /opt
COPY init/nginx_http.conf /opt
COPY init/nginx_https.conf /opt
COPY dist/gis-portal /usr/share/nginx/html

EXPOSE 80 443

CMD /opt/init_config.sh && nginx -g 'daemon off;'
