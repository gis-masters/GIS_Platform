#!/usr/bin/env bash
set -e
TAB='  '

echo "${TAB}Run migration: V5__geoserverJdbc"

mkdir -p ${GEOSERVER_DATA_DIR}/jdbcconfig;
mkdir -p ${GEOSERVER_DATA_DIR}/jdbcstore;
cp -r V5__geoserverJdbc/jdbcconfig/* ${GEOSERVER_DATA_DIR}/jdbcconfig;
cp -r V5__geoserverJdbc/jdbcstore/* ${GEOSERVER_DATA_DIR}/jdbcstore;

echo "5" > ${GEOSERVER_DATA_DIR}/migrationVersion

echo "${TAB}Done V5__geoserverJdbc"
echo

# Run Next migration, then new one will be added !!!
