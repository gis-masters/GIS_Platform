#!/usr/bin/env bash
set -e
TAB='  '

echo "${TAB}Run migration: V4__UpdateDb"

cp -f V4__UpdateDb/usergroup/config.xml ${GEOSERVER_DATA_DIR}/security/usergroup/postgres_db_user_service/config.xml
cp -f V4__UpdateDb/postgredb/config.xml ${GEOSERVER_DATA_DIR}/security/auth/PostgresDb/config.xml
cp -f V4__UpdateDb/role/config.xml ${GEOSERVER_DATA_DIR}/security/role/postgres_db_role_service/config.xml

echo "4" > ${GEOSERVER_DATA_DIR}/migrationVersion

echo "${TAB}Done V4__UpdateDb"
echo

#Run Next migration
