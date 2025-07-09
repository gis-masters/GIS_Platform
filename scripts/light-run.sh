#!/usr/bin/env bash

# Imports
. utils/textUtil

# Actions
. stop-all.sh

printHeader "Run CRG GIS (Light Version)"

# Function to modify JDBC enabled status
modify_jdbc_enabled() {
    local status=$1
    local config_file="../assets/migration-scripts/V5__geoserverJdbc/jdbcconfig/jdbcconfig.properties"
    local store_file="../assets/migration-scripts/V5__geoserverJdbc/jdbcstore/jdbcstore.properties"

    sed -i "s/enabled=.*/enabled=$status/" "$config_file"
    sed -i "s/enabled=.*/enabled=$status/" "$store_file"

    printHeader "JDBC configuration set to: $status"
}

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
export GEOSERVER_DATA_DIR=${GEOSERVER_DATA_DIR:-/opt/crg/data/geoserver}
export DB_DATA_DIR=${DB_DATA_DIR:-/opt/crg/data/postgres}

# Disable JDBC configuration before migrations
modify_jdbc_enabled false

pushd ../assets/ || exit
./migration-scripts/run.sh
popd || exit

printHeader "Docker compose UP"
docker compose -f ../docker-compose.dev.yml -f ../docker-compose.yml -f ../S3minio.yml --env-file ../.env.dev up -d

./wait.sh

# Note: uploadStylesFolder.sh is intentionally skipped for faster startup

# Re-enable JDBC configuration
modify_jdbc_enabled true

printHeader "Light run completed (styles upload skipped)"