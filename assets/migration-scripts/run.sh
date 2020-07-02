#!/usr/bin/env bash
pushd migration-scripts/

echo "List of migrations for geoserver catalog: ${GEOSERVER_DATA_DIR}"
ls -l

currentMigration=$(cat ${GEOSERVER_DATA_DIR}/migrationVersion)

if [[ currentMigration -eq 1 ]]; then
    echo "  Last completed migration: 'V1__Initial_Migration'";

    ./V2__AddJsonLogger/run.sh
elif [[ currentMigration -eq 2 ]]; then
    echo "  Last completed migration: 'V2__AddJsonLogger'";

    ./V3__AddProjections/run.sh
elif [[ currentMigration -eq 3 ]]; then
    echo "  Last completed migration: 'V3__AddProjections'";

    ./V4__UpdateDb/run.sh
elif [[ currentMigration -eq 4 ]]; then
    echo -e "  All migration completed";
else
    echo -e "  No migrations yet"
    ./V1__Initial_Migration/run.sh
fi

echo "Copy styles"
cp -r ../initialConfig/geoserver/styles/* ${GEOSERVER_DATA_DIR}/styles

popd
