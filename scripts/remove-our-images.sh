#!/usr/bin/env bash

# Imports
. utils/textUtil

# Actions
./stop-all.sh

printHeader "Remove images with our LABEL"

docker rmi -f $(docker images --filter "label=MAINTAINER=Fanatic Fiz <fanaticfiz@outlook.com>" --format "{{.ID}}")
