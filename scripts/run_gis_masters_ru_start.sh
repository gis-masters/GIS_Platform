#!/usr/bin/env bash

# Imports
. utils/textUtil

# Load environment variables from .env with proper variable expansion
if [ -f "../.env" ]; then
    set -a  # automatically export all variables
    source ../.env
    set +a  # disable auto-export
fi

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
export GEOSERVER_DATA_DIR=${GEOSERVER_DATA_DIR:-/opt/crg/data/geoserver}
export DB_DATA_DIR=${DB_DATA_DIR:-/opt/crg/data/postgres}

pushd ../assets/ || exit

echo "Using migration parameters:"
echo "  CRG_USER: ${CRG_USER}"
echo "  DB_PASS: ${DB_PASS}"
echo "  SECURITY_JWT_SECRET: ${SECURITY_JWT_SECRET}"
echo "#👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻#"

./migration-scripts/run.sh "${CRG_USER}" "${DB_PASS}" "${SECURITY_JWT_SECRET}"
popd || exit

printHeader "Docker compose UP"
docker compose -f ../gis_masters_ru_start.yml \
--env-file ../.env  up -d