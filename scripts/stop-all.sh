#!/usr/bin/env bash

# Imports
. utils/textUtil

# Actions
printHeader "Down CRG GIS"

docker compose -f ../docker-compose.dev.yml \
-f ../docker-compose.core.yml \
-f ../docker-compose.os.yml \
-f ../S3minio.yml \
-f ../gisogd-integration-sed.yml \
--env-file ../.env  down ||
  {
    echo '***** Failed stop containers *****'
    exit 1
  }
