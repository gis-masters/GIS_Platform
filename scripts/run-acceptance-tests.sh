#!/usr/bin/env bash

# Imports
. utils/textUtil

pushd ../
  # Получаем абсолютный путь к файлу .env
  ENV_FILE_PATH=$(pwd)/.env
  
  if [ "$1" == "-o" ]; then
    printHeader2 "Run @OnlyThis acceptance tests"

    mvn clean test -DskipAcceptanceTests=false \
                   -Dconfig.file="$ENV_FILE_PATH" \
                   -Dcucumber.filter.tags="@OnlyThis"
  elif [[ -z "$1" ]]; then
    printHeader2 "Run ALL acceptance tests (except @GisogdIntegration)"

    mvn clean test -DskipAcceptanceTests=false \
                   -Dconfig.file="$ENV_FILE_PATH"\
                   -Dcucumber.filter.tags="not @GisogdIntegration"

  else
    printHeader2 "Not acceptable parameter"
  fi
popd || exit
