#!/usr/bin/env bash

# Imports
. utils/textUtil

# Actions
pushd ../contracts/common-contracts || exit
mvn clean install || {
  printError "Failed to build common-contracts. See maven errors"
  exit 1
}
popd || exit

cp ../contracts/common-contracts/target/typescript-generator/* ../portal-ui/src/server-types

./clear-generated-files.sh
