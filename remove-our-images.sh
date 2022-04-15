#!/usr/bin/env bash

docker-compose -f docker-compose.dev.yml -f docker-compose.yml down;

echo '***** Remove images with our LABEL *****'
docker rmi -f $(docker images --filter "label=MAINTAINER=Fanatic Fiz <fanaticfiz@outlook.com>" --format "{{.ID}}")
