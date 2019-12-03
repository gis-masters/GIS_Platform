#!/usr/bin/env bash
set -e
TAB='  '

echo -e "${TAB}Run migration: V1__Initial_Migration"

./V1__Initial_Migration/initGeoserver.sh

echo "1" > ${GEOSERVER_DATA_DIR}/migrationVersion

echo -e "${TAB}Done V1__Initial_Migration"
echo

./V2__AddJsonLogger/run.sh
