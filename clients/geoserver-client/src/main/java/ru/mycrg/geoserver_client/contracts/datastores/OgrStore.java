package ru.mycrg.geoserver_client.contracts.datastores;

import ru.mycrg.geoserver_client.contracts.datastores.base.BaseParameterizedDataStore;

import java.util.HashMap;
import java.util.Map;

class OgrStore extends BaseParameterizedDataStore<Map<String, Object>> {

    /**
     * OGR data source.
     * <p>
     * Based on https://docs.geoserver.org/stable/en/user/community/ogr-store/index.html
     *
     * @param name Data store name
     */
    public OgrStore(String name) {
        super(name, new HashMap<>());

        connectionParameters.put("min connections", "1");
        connectionParameters.put("max connections", "20");
        connectionParameters.put("Connection timeout", "20");
        connectionParameters.put("Evictor tests per run", "3");
        connectionParameters.put("Max data source idle time", "300");
    }
}
