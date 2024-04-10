package ru.mycrg.geoserver_client.contracts.datastores;

import ru.mycrg.geoserver_client.contracts.datastores.base.BaseParameterizedDataStore;
import ru.mycrg.geoserver_client.contracts.datastores.base.IParameterizedStore;
import ru.mycrg.geoserver_client.contracts.datastores.base.PostGisConnectionParameters;

public class VectorDataStore extends BaseParameterizedDataStore<PostGisConnectionParameters>
        implements IParameterizedStore<PostGisConnectionParameters> {

    public VectorDataStore(String name, PostGisConnectionParameters connectionParameters) {
        super(name, connectionParameters);
    }
}
