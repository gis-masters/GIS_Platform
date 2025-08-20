#!/usr/bin/env bash

# Imports
. utils/textUtil

# Variables
GEOSERVER_DIR=$1/geoserver

# Checks
if [ -z "$1" ]; then
  printError "Задайте путь к расположению каталогу геосервера"
else
  printHeader2 "Удаляем каталог геосервера, по пути: $GEOSERVER_DIR"
fi

# Actions
rm -rf "$GEOSERVER_DIR"

printInfo "Каталог $GEOSERVER_DIR удалён"
