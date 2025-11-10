#!/usr/bin/env bash

# Imports
. utils/textUtil

# Чистим что есть на всякий случай
./remove-our-images.sh
docker rmi 10.10.10.165:5000/crg-ui:latest

printInfo "Пересобираем фронт"
cd ../portal-ui || exit
npm i
rm -rf dist/
npm run build

printInfo "Пересобираем сервисы"
cd ../scripts || exit
./build-run.sh

printInfo "Ретегирование образов"
docker tag 10.10.10.165:5000/crg-ui:latest                   gismaster/crg-ui:2_ru
docker tag 10.10.10.165:5000/crg-integration-service:latest  gismaster/crg-integration-service:2_ru
docker tag 10.10.10.165:5000/crg-gateway:latest              gismaster/crg-gateway:2_ru
docker tag 10.10.10.165:5000/crg-audit-service:latest        gismaster/crg-audit-service:2_ru
docker tag 10.10.10.165:5000/auth-service:latest             gismaster/auth-service:2_ru
docker tag 10.10.10.165:5000/crg-gis-service:latest          gismaster/crg-gis-service:2_ru
docker tag 10.10.10.165:5000/crg-data-service:latest         gismaster/crg-data-service:2_ru
docker tag 10.10.10.165:5000/geo-wrapper:latest              gismaster/geo-wrapper:2_ru

printInfo "Публикуем в реестр hub.docker"
docker push gismaster/crg-ui:2_ru
docker push gismaster/crg-integration-service:2_ru
docker push gismaster/crg-gateway:2_ru
docker push gismaster/crg-audit-service:2_ru
docker push gismaster/auth-service:2_ru
docker push gismaster/crg-gis-service:2_ru
docker push gismaster/crg-data-service:2_ru
docker push gismaster/geo-wrapper:2_ru

printSuccess "Свежие 2_ru образы опубликованы"
