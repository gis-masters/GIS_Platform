package ru.mycrg.geoserver_client.contracts.datastores;

import ru.mycrg.geoserver_client.contracts.datastores.base.BaseParameterizedDataStore;

import java.util.HashMap;
import java.util.Map;

public class VectorDataStore extends BaseParameterizedDataStore<Map<String, Object>> {

    public VectorDataStore(String name, Map<String, Object> params) {
        super(name, new HashMap<>());

        this.connectionParameters.put("host", params.get("host"));
        this.connectionParameters.put("port", params.get("port"));
        this.connectionParameters.put("database", params.get("database"));
        this.connectionParameters.put("schema", params.get("schema"));
        this.connectionParameters.put("user", params.get("user"));
        this.connectionParameters.put("passwd", params.get("passwd"));

        this.connectionParameters.put("dbtype", "postgis");
        this.connectionParameters.put("Expose primary keys", true);
    }
}
