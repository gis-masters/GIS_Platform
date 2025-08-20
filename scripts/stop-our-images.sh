#!/usr/bin/env bash

# Imports
. utils/textUtil

# Actions
printHeader "Stop all images with our LABEL"

docker stop $(docker ps --filter "label=MAINTAINER=Fanatic Fiz <fanaticfiz@outlook.com>" --format "{{.Names}}")
