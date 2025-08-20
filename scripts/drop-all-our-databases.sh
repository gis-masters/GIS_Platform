#!/usr/bin/env bash

# Imports
. utils/textUtil

# Variables
CONTAINER_NAME=postgis
DB_NAME=postgres
DB_USERNAME=full_me_up
DB_PASS=and_me_too
HOST=localhost
PORT=5432

function dropDatabase() {
  docker exec -it $CONTAINER_NAME psql --dbname=$DB_NAME://$DB_USERNAME:$DB_PASS@$HOST:$PORT/$DB_NAME -c "UPDATE
    pg_database SET datallowconn = 'false' WHERE datname = '$1'; SELECT pg_terminate_backend
    (pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '$1' AND pid <> pg_backend_pid();"
  echo "Close connections to $1 SUCCESS"

  docker exec -u postgres $CONTAINER_NAME /usr/bin/dropdb --if-exists $1
  echo "Drop DB $1 SUCCESS"
}

# Actions
dropDatabase bpmn_camunda
dropDatabase crg_audit_service
dropDatabase crg_auth_service
dropDatabase crg_data_service
dropDatabase crg_gis_service
dropDatabase geoserver_db

# Для посмотреть всех интересных нам БД можно использовать такой запрос
# psql --dbname=postgres://DB_USERNAME:DB_PASS@localhost:5432/postgres -c "SELECT datname FROM pg_database WHERE datname NOT LIKE 'template%' AND datname <> 'postgres'"

# Пока хардкод на одну таблицу
dropDatabase database_1
