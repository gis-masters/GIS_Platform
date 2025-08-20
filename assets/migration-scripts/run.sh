#!/usr/bin/env bash

# Check if required parameters are provided
if [ $# -lt 2 ]; then
    echo "Usage: $0 CRG_USER DB_PASS [JWT_SECRET]"
    echo "Example: $0 myuser mypassword jwt_secret_token"
    exit 1
fi

CRG_USER="$1"
DB_PASS="$2"
JWT_SECRET="$3"

# Export variables for child scripts
export CRG_USER
export DB_PASS
export JWT_SECRET


pushd migration-scripts/ || exit

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
    echo -e "  Last completed migration: 'V4__UpdateDb'";

    ./V5__geoserverJdbc/run.sh
elif [[ currentMigration -eq 5 ]]; then
    echo -e "  All migration before docker completed";
else
    echo -e "  No migrations before docker yet"
    ./V1__Initial_Migration/run.sh
fi

echo "Copy specializations"
mkdir -p /opt/crg/specializations
cp -r ../specializations/* /opt/crg/specializations/

popd || exit
