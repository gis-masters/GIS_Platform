#!/usr/bin/env bash

# Imports
. utils/textUtil

# Actions
printHeader2 "Stop images"

./stop-all.sh

printInfo "As sudo"
sudo echo ...

printInfo "Clear geoserver data"
sudo rm -rf /opt/data/geoserver

printInfo "Clear database"
sudo rm -rf /opt/data/postgis

printInfo "Clear file storage"
sudo rm -rf /opt/file_storage/*

printInfo "Clear qwc storage"
sudo rm -rf /opt/gwc_storage/*

printInfo "Clear export"
sudo rm -rf /opt/export/*

printSuccess "Done"
