package ru.mycrg.geoserver_client.contracts.datastores;

import ru.mycrg.geoserver_client.contracts.datastores.base.BaseParameterizedDataStore;

import java.util.HashMap;
import java.util.Map;

public class ShpDataStore extends BaseParameterizedDataStore<Map<String, Object>> {

    /**
     * Create shape dataStore with default connection parameters.
     *
     * @param name       Data store name
     * @param pathToFile inner path to file like "/opt/crg/geoserver/data_dir/some.shp".
     */
    public ShpDataStore(String name, String pathToFile) {
        super(name, new HashMap<>());

        connectionParameters.put("charset", "UTF-8");
        connectionParameters.put("filetype", "shapefile");
        connectionParameters.put("fstype", "shape");
        connectionParameters.put("timezone", "GMT");
        connectionParameters.put("skipScan", true);
        connectionParameters.put("create spatial index", true);
        connectionParameters.put("enable spatial index", true);
        connectionParameters.put("memory mapped buffer", false);
        connectionParameters.put("cache and reuse memory maps", true);
        connectionParameters.put("url", "file://" + pathToFile);
    }
}
