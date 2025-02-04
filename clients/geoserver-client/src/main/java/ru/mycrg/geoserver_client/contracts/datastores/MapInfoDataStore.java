package ru.mycrg.geoserver_client.contracts.datastores;

import static ru.mycrg.geoserver_client.contracts.datastores.base.Drivers.MAP_INFO;

public class MapInfoDataStore extends OgrStore {

    public MapInfoDataStore(String name, String pathToFile) {
        super(name);

        connectionParameters.put("DatasourceName", pathToFile);
        connectionParameters.put("DriverName", MAP_INFO.getName());
    }
}
