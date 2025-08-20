#!/usr/bin/env bash

# Imports
. utils/textUtil

# Actions
. stop-all.sh

pushd ../
mvn clean install || {
  printError "Maven build failed. See maven errors"
  exit 1
}
popd || exit

. run.sh "$1"
