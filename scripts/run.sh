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

printHeader "Docker compose UP"
docker-compose -f ../docker-compose.dev.yml -f ../docker-compose.yml --env-file ../.env up
