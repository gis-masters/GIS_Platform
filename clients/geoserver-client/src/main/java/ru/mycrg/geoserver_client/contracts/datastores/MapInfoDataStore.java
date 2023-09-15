package ru.mycrg.geoserver_client.contracts.datastores;

import java.util.HashMap;
import java.util.Map;

public class MapInfoDataStore extends BaseParameterizedDataStore<Map<String, Object>> {

    /**
     * Create MapInfo dataStore with default connection parameters.
     *
     * @param name       Data store name
     * @param pathToFile inner path to file like "/opt/geoserver/data_dir/some.mid".
     */
    public MapInfoDataStore(String name, String pathToFile) {
        super(name, new HashMap<>());

        connectionParameters.put("DatasourceName", pathToFile);
        connectionParameters.put("DriverName", "MapInfo File");
        connectionParameters.put("min connections", "1");
        connectionParameters.put("max connections", "20");
        connectionParameters.put("Connection timeout", "20");
        connectionParameters.put("Evictor tests per run", "3");
        connectionParameters.put("Max data source idle time", "300");
    }

    public MapInfoDataStore(String name, Map<String, Object> connectionParameters) {
        super(name, connectionParameters);
    }

    @Override
    public String toString() {
        return "{" +
                "\"connectionParameters\":" + (connectionParameters == null ? "null" : connectionParameters) + ", " +
                "\"name\":" + (name == null ? "null" : "\"" + name + "\"") +
                "}";
    }
}
