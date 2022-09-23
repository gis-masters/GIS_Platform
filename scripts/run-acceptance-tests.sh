#!/usr/bin/env bash

# Imports
. utils/textUtil

pushd ../
  if [ "$1" == "-o" ]; then
    printHeader2 "Run @OnlyThis acceptance tests"

    mvn clean test -DskipAcceptanceTests=false \
                   -Denv.HOST=http://localhost \
                   -Denv.PORT=8100 \
                   -Denv.ROOT_NAME=admin@mail.ru \
                   -Denv.ROOT_PASS=geoserver \
                   -Dcucumber.filter.tags="@OnlyThis"
  elif [[ -z "$1" ]]; then
    printHeader2 "Run ALL acceptance tests"

    mvn clean test -DskipAcceptanceTests=false \
                   -Denv.HOST=http://localhost \
                   -Denv.PORT=8100 \
                   -Denv.ROOT_NAME=admin@mail.ru \
                   -Denv.ROOT_PASS=geoserver
  else
    printHeader2 "Not acceptable parameter"
  fi
popd || exit
