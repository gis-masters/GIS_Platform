#!/usr/bin/env bash

# Imports
. utils/textUtil

# Actions
printHeader "Down CRG GIS"

docker compose -f ../docker-compose.dev.yml \
-f ../coreApplication.yml \
-f ../openSources.yml \
-f ../monitoring.yml \
-f ../S3MinioForTests.yml \
-f ../gisogdIntegrationSed.yml \
-f ../gisogdRfService.yml \
--env-file ../.env --profile "*"  down ||
  {
    echo '***** Failed stop containers *****'
    exit 1
  }
