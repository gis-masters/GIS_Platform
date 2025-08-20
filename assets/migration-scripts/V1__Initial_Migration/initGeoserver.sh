#!/usr/bin/env bash
set -e
TAB='    '

echo -e "${TAB}"INIT GEOSERVER
if [ ! -d ${GEOSERVER_DATA_DIR} ]; then
    echo -e "${TAB}  Catalog ${GEOSERVER_DATA_DIR} not exist, create."
    mkdir -m 777 -p ${GEOSERVER_DATA_DIR}
fi
if [[ $(ls -l ${GEOSERVER_DATA_DIR} | wc -l) -gt 1 ]]; then
    echo -e "${TAB}  ${GEOSERVER_DATA_DIR} is not empty. Do nothing."
else
    echo -e "${TAB}" ${GEOSERVER_DATA_DIR} "is empty. Init initial resources"

    # Create temporary directory for processed files
    TEMP_DIR=$(mktemp -d)
    trap "rm -rf $TEMP_DIR" EXIT

    # Copy all files first
    cp -a ../initialConfig/geoserver/* ${GEOSERVER_DATA_DIR}

    # Process JWT config.xml if JWT_SECRET is provided
    JWT_CONFIG_FILE="${GEOSERVER_DATA_DIR}/security/filter/JWT/config.xml"
    if [ -n "$JWT_SECRET" ] && [ -f "$JWT_CONFIG_FILE" ]; then
        echo -e "${TAB}  Updating JWT config with provided secret"
        # Use sed to replace the placeholder with the actual JWT_SECRET
        sed "s|\${SECURITY_JWT_SECRET}|$JWT_SECRET|g" "$JWT_CONFIG_FILE" > "$TEMP_DIR/jwt_config.xml"
        cp -f "$TEMP_DIR/jwt_config.xml" "$JWT_CONFIG_FILE"
        echo -e "${TAB}  JWT config updated successfully"
    elif [ -f "$JWT_CONFIG_FILE" ]; then
        echo -e "${TAB}  Warning: JWT_SECRET not provided, JWT config will contain placeholder"
    fi
fi
