#!/usr/bin/env bash

echo Run CRG GIS

echo Init variables
export DOCKER_CRG_HOST=${DOCKER_CRG_HOST:-cr.yandex/crp7o80lcrqlf17up9fq}

export JAVA_XMS_SIZE=${JAVA_XMS_SIZE:-2G}
export JAVA_XMX_SIZE=${JAVA_XMX_SIZE:-4G}

export APM_URL=${APM_URL:-10.10.10.10}

export CRG_USER=${CRG_USER:-fiz}
export RABBIT_PASS=${RABBIT_PASS:-314}
export DB_PASS=${DB_PASS:-314}
export GEOSERVER_USER=${GEOSERVER_USER:-admin@mail.ru}
export GEOSERVER_PASSWORD=${GEOSERVER_PASSWORD:-geoserver}

export RABBIT_TAG=${RABBIT_TAG:-management}
export POSTGRES_TAG=${POSTGRES_TAG:-11.2}
export POSTGIS_TAG=${POSTGIS_TAG:-11.7-2.5}
export IS_DATA_EXIST=${IS_DATA_EXIST:-}
export GEOSERVER_TAG=${GEOSERVER_TAG:-2.16.0}

export CRG_DATA_SERVICE_TAG=${CRG_DATA_SERVICE_TAG:-latest}
export CRG_REGISTRY_TAG=${CRG_REGISTRY_TAG:-latest}
export CRG_AUTH_TAG=${CRG_AUTH_TAG:-latest}
export CRG_GIS_SERVICE_TAG=${CRG_GIS_SERVICE_TAG:-latest}
export CRG_GATEWAY_TAG=${CRG_GATEWAY_TAG:-latest}
export CRG_API_TAG=${CRG_API_TAG:-latest}
export CRG_WRAPPER_TAG=${CRG_WRAPPER_TAG:-latest}
export CRG_UI_TAG=${CRG_UI_TAG:-latest}

export ELK_IMAGE_TAG=${ELK_IMAGE_TAG:-7.4.2}
export ELASTICSEARCH_PASSWORD=${ELASTICSEARCH_PASSWORD:-changeFiz}
export ELASTICSEARCH_USERNAME=${ELASTICSEARCH_USERNAME:-elastic}
export ELASTICSEARCH_HOST=${ELASTICSEARCH_HOST:-10.10.10.186}
export KIBANA_HOST=${KIBANA_HOST:-10.10.10.186}
export LOGSTASH_HOST=${LOGSTASH_HOST:-10.10.10.186}

export UI_PLATFORM=${UI_PLATFORM:-convDev}
export UI_PROD=${UI_PROD:-false}
export UI_SERVER_HOST=${UI_SERVER_HOST:-localhost}
export UI_SERVER_PORT=${UI_SERVER_PORT:-8100}
export UI_SWN=${UI_SWN:-scratch}
export UI_WS_PORT=${UI_WS_PORT:-8088}


echo Init migrations
export GEOSERVER_DATA_DIR=${GEOSERVER_DATA_DIR:-/opt/data/geoserver}
export DB_DATA_DIR=${DB_DATA_DIR:-/opt/data/postgres}

pushd assets/
./migration-scripts/run.sh
popd

echo Docker compose UP
docker-compose -f docker-compose.dev.yml -f docker-compose.yml up
