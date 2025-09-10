#!/usr/bin/env bash

# Imports
. utils/textUtil

# Load environment variables from .env with proper variable expansion
if [ -f "../.env" ]; then
    set -a  # automatically export all variables
    # Load .env but skip lines with dots in variable names (they are for Java tests)
    while IFS= read -r line || [[ -n "$line" ]]; do
        # Skip empty lines and comments
        [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]] && continue
        # Skip lines with dots in variable names (Java test variables)
        [[ "$line" =~ ^[^=]*\.[^=]*= ]] && continue
        # Export valid bash variables (allow variable references like ${VAR})
        if [[ "$line" =~ ^[A-Za-z_][A-Za-z0-9_]*=.*$ ]]; then
            eval "export $line"
        fi
    done < "../.env"
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
echo "  GEOSERVER_UI_LOGIN: ${GEOSERVER_UI_LOGIN}"
echo "  GEOSERVER_UI_PASSWORD: ${GEOSERVER_UI_CRYPTED_PASSWORD}"

echo "#👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻👻#"

./migration-scripts/run.sh "${CRG_USER}" "${DB_PASS}" "${SECURITY_JWT_SECRET}" "${GEOSERVER_UI_LOGIN}" "${GEOSERVER_UI_CRYPTED_PASSWORD}"
popd || exit

printHeader "Docker compose UP"
docker compose -f ../docker-compose.dev.yml \
-f ../coreApplication.yml \
-f ../openSources.yml \
-f ../monitoring.yml \
-f ../S3MinioForTests.yml \
-f ../gisogdIntegrationSed.yml \
--env-file ../.env  up -d

./wait.sh
