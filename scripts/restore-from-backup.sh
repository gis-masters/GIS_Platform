#!/usr/bin/env bash

# Imports
. utils/textUtil

# Variables
BASE_DIR=/opt/crg/data

# Checks
if [ -z "$1" ]; then
  printHeader2 "Первым аргументом передайте путь к файлу бекапа базы данных"
  exit
else
  printInfo "Задан путь к файлу бекапа базы данных: $1"
fi

if [ -z "$2" ]; then
  printHeader2 "Вторым аргументом передайте путь к файлу бекапа геосервера"
  exit
else
  printInfo "Задан путь к файлу бекапа геосервера: $2"
fi

if [ -z "$3" ]; then
  printInfo "По умолчанию базовый каталог для восстановления: $BASE_DIR"
else
  BASE_DIR=$3
  printInfo "Задан каталог для восстановления: $BASE_DIR"
fi

if [ ! -f "$1" ]; then
  printError "File with db backup $1 not found!"
  exit
fi

if [ ! -f "$2" ]; then
  printError "File with geoserver backup $1 not found!"
  exit
fi

# Actions
printHeader2 "Process start"
echo "Start" >> result.txt
date +"%D %T" >> result.txt

. stop-except-db.sh
. drop-all-our-databases.sh
. delete-geoserver-data.sh "$BASE_DIR"
. restore-geoserver.sh "$2" "$BASE_DIR"
. restore-db.sh "$1" "$BASE_DIR"
. stop-all.sh
. run.sh

printInfo "Done"
echo "Done" >> result.txt
date +"%D %T" >> result.txt
