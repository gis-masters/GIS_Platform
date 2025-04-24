#!/usr/bin/env bash

# Imports
. utils/textUtil

pushd ../
  if [ "$1" == "-o" ]; then
    printHeader2 "Run @OnlyThis acceptance tests"

    mvn clean test -DskipAcceptanceTests=false \
                   -Dconfig.file=../../.env \
                   -Dcucumber.filter.tags="@OnlyThis"
  elif [[ -z "$1" ]]; then
    printHeader2 "Run ALL acceptance tests (except @Smev)"

    mvn clean test -DskipAcceptanceTests=false \
                   -Dconfig.file=../../.env \
                   -Dcucumber.filter.tags="not @Smev"
  else
    printHeader2 "Not acceptable parameter"
  fi
popd || exit
