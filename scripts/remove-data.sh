#!/usr/bin/env bash

# Imports
. utils/textUtil

# Actions
printHeader2 "Stop images"

./stop-all.sh

printInfo "As sudo"
sudo echo ...

printInfo "Clear data"
sudo rm -rf /opt/crg/*

printSuccess "Done"
