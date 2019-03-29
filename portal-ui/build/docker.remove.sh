#!/bin/bash

echo ========================
echo === Try remove image ===
echo ========================

if [ "$(docker images $REPOSERVER/$WEB_SERVICE | awk '{print $2}' | grep $TAG)" != "" ]; then
  docker rmi  $WEB_IMAGE
  echo удалён образ $WEB_IMAGE
else
  echo удаление образа $WEB_IMAGE : образ не найден
fi
