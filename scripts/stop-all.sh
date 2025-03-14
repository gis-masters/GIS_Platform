#!/usr/bin/env bash

# Imports
. utils/textUtil

# Actions
printHeader "Down CRG GIS"

docker compose -f ../docker-compose.dev.yml -f ../docker-compose.yml -f ../S3minio.yml --env-file ../.env down ||
  {
    echo '***** Failed stop containers *****'
    exit 1
  }
