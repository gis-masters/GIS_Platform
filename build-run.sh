#!/usr/bin/env bash

docker-compose -f docker-compose.dev.yml -f docker-compose.yml down
mvn clean install
./run.sh
