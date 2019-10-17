#!/usr/bin/env bash

echo Remove default nginx config
rm /etc/nginx/conf.d/default.conf

echo Generate enviroment.json
echo -e "{\n  \"platform\": \"$UI_PLATFORM\",\n  \"production\": $UI_PROD,\n  \"server\": {\n    \"host\": \
\"$UI_SERVER_HOST\",\n    \"port\": $UI_SERVER_PORT\n  },\n  \"ws_port\": \"$UI_WS_PORT\",\n  \
\"scratchWorkspaceName\": \"$UI_SWN\"\n}" > environment.json

echo copy to assets
cp environment.json /usr/share/nginx/html/assets/config

echo exit
exec "$@"
