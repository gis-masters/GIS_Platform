package ru.mycrg.geoserver_client.contracts.datastores;

import ru.mycrg.geoserver_client.contracts.datastores.base.BaseParameterizedDataStore;
import ru.mycrg.geoserver_client.contracts.datastores.base.PostGisConnectionParameters;

public class VectorDataStore extends BaseParameterizedDataStore<PostGisConnectionParameters> {

    public VectorDataStore(String name, PostGisConnectionParameters connectionParameters) {
        super(name, connectionParameters);
    }
}
