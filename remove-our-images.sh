#!/usr/bin/env bash

echo '***** Remove images with our LABEL *****'
docker rmi -f $(docker images --filter "label=MAINTAINER=Fanatic Fiz <fanaticfiz@outlook.com>" --format "{{.ID}}")
