mkdir -p ${GEOSERVER_DATA_DIR}/jdbcconfig;
mkdir -p ${GEOSERVER_DATA_DIR}/jdbcstore;
cp -r ../initialConfig/geoserver/jdbcconfig/* ${GEOSERVER_DATA_DIR}/jdbcconfig;
cp -r ../initialConfig/geoserver/jdbcstore/* ${GEOSERVER_DATA_DIR}/jdbcstore;