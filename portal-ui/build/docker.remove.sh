#!/bin/bash

echo === Try remove image ===

if [ "$(docker images $REPO_SERVER/$WEB_SERVICE | awk '{print $2}' | grep $TAG)" != "" ]; then
  docker rmi  $WEB_IMAGE
  echo удалён образ $WEB_IMAGE
else
  echo удаление образа $WEB_IMAGE : образ не найден
fi
