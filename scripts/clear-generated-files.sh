#!/usr/bin/env bash

# Imports
. utils/textUtil

# Actions
search_dir=../portal-ui/src/server-types
for entry in "$search_dir"/*; do
  sed -i \
    -e '/^\/\* tslint:disable \*\/$/d' \
    -e '/^\/\* eslint-disable \*\/$/d' \
    -e '/^\/\/ Generated using typescript-generator version .*$/d' \
    "$entry"
done
