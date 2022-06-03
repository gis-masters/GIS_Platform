#!/usr/bin/env bash

# Imports
. utils/textUtil

# Variables
CONTAINER_NAME=postgis
DATABASE_DIR=postgis
PATH_TO_BACKUP=$1
BASE_DIR=$2
BACKUP_FILE_GZ=
UNZIPPED_FILE=

# Checks
if [ -z "$1" ]; then
  printError "Задайте путь к файлу с бекапом базы данных"
else
  BACKUP_FILE_GZ=$(basename "$PATH_TO_BACKUP")

  full_name=$1
  xbase=${full_name##*/}
  UNZIPPED_FILE=${xbase%.*}
fi

if [ -z "$2" ]; then
  printError "Задайте путь к каталогу с БД"
fi

# Actions
printHeader2 "Восстанавливаем базу данных, по пути: $BASE_DIR/$DATABASE_DIR"

printInfo "  Copy file"
cp "$PATH_TO_BACKUP" "$BASE_DIR"/$DATABASE_DIR

printInfo "  Unzip it"
gunzip -qf "$BASE_DIR"/$DATABASE_DIR/"$BACKUP_FILE_GZ"

printInfo "  Make restore"
docker exec -u postgres $CONTAINER_NAME psql -f /var/lib/postgresql/"$UNZIPPED_FILE"

printInfo "  База данных восстановлена"
