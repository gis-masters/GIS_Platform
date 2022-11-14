#!/usr/bin/env bash

# Imports
. utils/textUtil

# Actions
search_dir=../portal-ui/src/server-types
for entry in "$search_dir"/*; do
  sed -i '1,3d' "$entry"
done
