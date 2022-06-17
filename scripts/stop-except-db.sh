#!/usr/bin/env bash

# Imports
. utils/textUtil

# Actions
printHeader "Stop all images except postgis"

. stop-our-images.sh

docker stop rabbitmq geoserver
