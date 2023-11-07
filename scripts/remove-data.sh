#!/usr/bin/env bash

# Imports
. utils/textUtil

# Actions
printHeader2 "Stop images"

./stop-all.sh

printInfo "As sudo"
sudo echo ...

printInfo "Clear geoserver data"
rm -rf /opt/data/geoserver

printInfo "Clear database"
rm -rf /opt/data/postgis

printInfo "Clear file storage"
rm -rf /opt/file_storage/*

printInfo "Clear qwc storage"
rm -rf /opt/gwc_storage/*

printInfo "Clear export"
rm -rf /opt/export/*

printSuccess "Done"
