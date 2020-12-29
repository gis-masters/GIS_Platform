#!/usr/bin/env bash

echo Remove default nginx config
rm /etc/nginx/conf.d/default.conf

echo Copy nginx config
if [ -n "$UI_HTTPS" ]
then
  cp /opt/nginx_https.conf /etc/nginx/conf.d
else
  cp /opt/nginx_http.conf /etc/nginx/conf.d
fi

echo Generate enviroment.json
echo -e "{\
\"platform\":\"$UI_PLATFORM\",\
\"production\":$UI_PROD,\
\"server\":{\
  \"host\":\"$UI_SERVER_HOST\",\
  \"port\":\"$UI_SERVER_PORT\",\
  \"path\":\"$UI_SERVER_PATH\",\
  \"wsPort\":\"$UI_WS_PORT\",\
  \"wsPath\":\"$UI_WS_PATH\"\
},\
\"scratchWorkspaceName\":\"$UI_SWN\",\
\"logo\":\"$UI_LOGO\",\
\"favicon\":\"$UI_FAVICON\"\
}" > environment.json

echo copy to assets
cp environment.json /usr/share/nginx/html/assets/config

echo exit
exec "$@"
