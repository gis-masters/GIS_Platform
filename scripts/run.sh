#!/usr/bin/env bash

# Imports
. utils/textUtil

# Actions
printHeader "Run CRG GIS"

while [ -n "$1" ]; do
  case "$1" in
  -clear)
    printHeader "CLEAR DB"
    export RECREATE_DATADIR="True"
    ;;
  *)
    printError "unknown options"
    exit
    ;;
  esac
  shift
done

printHeader "Init migrations"
export GEOSERVER_DATA_DIR=${GEOSERVER_DATA_DIR:-/opt/data/geoserver}
export DB_DATA_DIR=${DB_DATA_DIR:-/opt/data/postgres}

pushd ../assets/ || exit
./migration-scripts/run.sh
popd || exit

printHeader "Copy database configs"
sudo mkdir -p /opt/data/configs/db
sudo cp ../configs/db/extra.conf /opt/data/configs/db/extra.conf

printHeader "Docker compose UP"
docker compose -f ../docker-compose.dev.yml -f ../docker-compose.yml -f ../S3minio.yml --env-file ../.env up -d

./wait.sh

#мне кажется есть кейсы когда это будет полезно
#pushd ../assets/migration-scripts/ || exit
#./uploadStylesFolder.sh "admin@mail.ru" "Esterhazy2022"
#popd || exit
