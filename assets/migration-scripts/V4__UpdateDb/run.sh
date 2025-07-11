#!/usr/bin/env bash
set -e
TAB='  '

echo "${TAB}Run migration: V4__UpdateDb"

# Create temporary directory for processed files
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

# Process usergroup config.xml
sed "s/\${CRG_USER}/${CRG_USER}/g; s/\${DB_PASS}/${DB_PASS}/g" V4__UpdateDb/usergroup/config.xml > "$TEMP_DIR/usergroup_config.xml"
cp -f "$TEMP_DIR/usergroup_config.xml" ${GEOSERVER_DATA_DIR}/security/usergroup/postgres_db_user_service/config.xml

# Copy postgredb config.xml (no variables to replace)
cp -f V4__UpdateDb/postgredb/config.xml ${GEOSERVER_DATA_DIR}/security/auth/PostgresDb/config.xml

# Process role config.xml
sed "s/\${CRG_USER}/${CRG_USER}/g; s/\${DB_PASS}/${DB_PASS}/g" V4__UpdateDb/role/config.xml > "$TEMP_DIR/role_config.xml"
cp -f "$TEMP_DIR/role_config.xml" ${GEOSERVER_DATA_DIR}/security/role/postgres_db_role_service/config.xml

echo "4" > ${GEOSERVER_DATA_DIR}/migrationVersion

echo "${TAB}Done V4__UpdateDb"
echo

./V5__geoserverJdbc/run.sh
