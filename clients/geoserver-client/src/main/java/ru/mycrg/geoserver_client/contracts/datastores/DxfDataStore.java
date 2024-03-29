package ru.mycrg.geoserver_client.contracts.datastores;

import static ru.mycrg.geoserver_client.contracts.datastores.base.Drivers.DXF;

public class DxfDataStore extends OgrStore {

    public DxfDataStore(String name, String pathToFile) {
        super(name);

        connectionParameters.put("DatasourceName", pathToFile);
        connectionParameters.put("DriverName", DXF.getName());
    }
}
