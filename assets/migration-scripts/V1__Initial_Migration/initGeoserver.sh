#!/usr/bin/env bash
set -e
TAB='    '

echo -e "${TAB}"INIT GEOSERVER
if [ ! -d ${GEOSERVER_DATA_DIR} ]; then
    echo -e "${TAB}  Catalog ${GEOSERVER_DATA_DIR} not exist, create."
    mkdir -m 777 -p ${GEOSERVER_DATA_DIR}
fi
if [[ $(ls -l ${GEOSERVER_DATA_DIR} | wc -l) -gt 1 ]]; then
    echo -e "${TAB}  ${GEOSERVER_DATA_DIR} is not empty. Do nothing."
else
    echo -e "${TAB}" ${GEOSERVER_DATA_DIR} "is empty. Init initial resources"

    cp -a ../initialConfig/geoserver/* ${GEOSERVER_DATA_DIR}
fi
