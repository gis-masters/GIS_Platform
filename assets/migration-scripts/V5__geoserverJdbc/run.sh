#!/usr/bin/env bash
set -e
TAB='  '

echo "${TAB}Run migration: V5__geoserverJdbc"

# Create temporary directory for processed files
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

mkdir -p ${GEOSERVER_DATA_DIR}/jdbcconfig;
mkdir -p ${GEOSERVER_DATA_DIR}/jdbcstore;

# Copy jdbcconfig files with variable substitution
cp -r V5__geoserverJdbc/jdbcconfig/* "$TEMP_DIR/"
# Process jdbcconfig.properties
if [ -f "$TEMP_DIR/jdbcconfig.properties" ]; then
    sed "s/\${CRG_USER}/${CRG_USER}/g; s/\${DB_PASS}/${DB_PASS}/g" "$TEMP_DIR/jdbcconfig.properties" > "$TEMP_DIR/jdbcconfig_processed.properties"
    mv "$TEMP_DIR/jdbcconfig_processed.properties" "$TEMP_DIR/jdbcconfig.properties"
fi
cp -r "$TEMP_DIR"/* ${GEOSERVER_DATA_DIR}/jdbcconfig/

# Copy jdbcstore files with variable substitution
rm -rf "$TEMP_DIR"/*
cp -r V5__geoserverJdbc/jdbcstore/* "$TEMP_DIR/"
# Process jdbcstore.properties
if [ -f "$TEMP_DIR/jdbcstore.properties" ]; then
    sed "s/\${CRG_USER}/${CRG_USER}/g; s/\${DB_PASS}/${DB_PASS}/g" "$TEMP_DIR/jdbcstore.properties" > "$TEMP_DIR/jdbcstore_processed.properties"
    mv "$TEMP_DIR/jdbcstore_processed.properties" "$TEMP_DIR/jdbcstore.properties"
fi
cp -r "$TEMP_DIR"/* ${GEOSERVER_DATA_DIR}/jdbcstore/

echo "5" > ${GEOSERVER_DATA_DIR}/migrationVersion

echo "${TAB}Done V5__geoserverJdbc"
echo

# Run Next migration, then new one will be added !!!
