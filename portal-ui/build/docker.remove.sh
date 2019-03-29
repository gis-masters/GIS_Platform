#!/bin/bash

#source $DIR/deploy/docker.stop.sh

# Не работает поиск по тэгам на сервере, используем grep для поиска образа
if [ "$(docker images $REPOSERVER/$WEB_SERVICE | awk '{print $2}' | grep $TAG)" != "" ]; then
  docker rmi  $WEB_IMAGE
  echo удалён образ $WEB_IMAGE
else
  echo удаление образа $WEB_IMAGE : образ не найден
fi
