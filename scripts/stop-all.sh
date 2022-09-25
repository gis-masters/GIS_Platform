#!/usr/bin/env bash

# Imports
. utils/textUtil

# Actions
printHeader "Down CRG GIS"

docker-compose -f ../docker-compose.dev.yml -f ../docker-compose.yml down ||
  {
    echo '***** Failed stop containers *****'
    exit 1
  }
