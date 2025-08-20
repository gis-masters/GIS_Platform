#!/usr/bin/env bash
set -e
TAB='  '

echo "${TAB}Run migration: V3__AddProjections"

cp -r V3__AddProjections/user_projections/ ${GEOSERVER_DATA_DIR}/

echo "3" > ${GEOSERVER_DATA_DIR}/migrationVersion

echo "${TAB}Done V3__AddProjections"
echo

./V4__UpdateDb/run.sh
