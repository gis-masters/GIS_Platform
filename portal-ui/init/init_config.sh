#!/usr/bin/env bash

echo Remove default nginx config
rm /etc/nginx/conf.d/default.conf

echo Generate enviroment.json
echo -e "{\
\"platform\":\"$UI_PLATFORM\",\
\"production\":$UI_PROD,\
\"server\":{\"host\":\"$UI_SERVER_HOST\",\"port\":$UI_SERVER_PORT},\
\"ws_port\":\"$UI_WS_PORT\",\
\"scratchWorkspaceName\":\"$UI_SWN\",\
\"logo\":\"$UI_LOGO\",\
\"favicon\":\"$UI_FAVICON\"\
}" > environment.json

echo copy to assets
cp environment.json /usr/share/nginx/html/assets/config

echo exit
exec "$@"
