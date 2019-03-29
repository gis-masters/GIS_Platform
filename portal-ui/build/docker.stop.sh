#!/bin/bash

if [ "$(docker ps -q -f name=$WEB_SERVICE)" ]; then
  docker stop $WEB_SERVICE
  echo остановлен контейнер $WEB_SERVICE
else
  echo остановка контейнера $WEB_SERVICE: контейнер не найден
fi
