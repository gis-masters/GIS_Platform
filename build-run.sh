#!/usr/bin/env bash

docker-compose -f docker-compose.dev.yml -f docker-compose.yml down ||
{ echo '***** Failed stop containers *****' ; exit 1; }

mvn clean install || { echo '***** Build failed. See maven errors *****' ; exit 1; }

./run.sh
