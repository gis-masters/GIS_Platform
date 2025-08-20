#!/usr/bin/env bash

# Imports
. utils/textUtil

# Variables
FILE=$1
BASE_DIR=$2

# Checks
if [ -z $1 ]; then
  printError "Задайте путь к файлу с бекапом геосервера"
fi

if [ -z $2 ]; then
  printError "Задайте путь куда будет развернут геосервер"
fi

# Actions
printHeader2 "Восстанавливаем каталог геосервера, по пути: $BASE_DIR/geoserver"

tar -xf $FILE -C $BASE_DIR
mv $BASE_DIR/opt/crg/data/* $BASE_DIR
rm -rf $BASE_DIR/opt

printInfo "Каталог геосервера восстановлен"
