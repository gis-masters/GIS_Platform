#!/usr/bin/env bash
# run from root './build/build-image.sh'

echo Remove old files
rm -rf dist

echo Generate new
ng build

echo Build docker image
docker build -t 10.10.10.165:5000/nginx-portal .

echo Done
