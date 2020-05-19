#!/usr/bin/env bash
set -e
TAB='  '

echo "${TAB}Run migration: V2__AddJsonLogger"

cp V2__AddJsonLogger/JSON_LOGGING.properties ${GEOSERVER_DATA_DIR}/logs/
cp V2__AddJsonLogger/logging.xml ${GEOSERVER_DATA_DIR}/

echo "2" > ${GEOSERVER_DATA_DIR}/migrationVersion

echo "${TAB}Done V2__AddJsonLogger"
echo

./V3__AddProjections/run.sh
