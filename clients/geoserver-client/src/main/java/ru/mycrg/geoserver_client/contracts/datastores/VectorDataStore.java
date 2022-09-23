package ru.mycrg.geoserver_client.contracts.datastores;

public class VectorDataStore extends BaseParameterizedDataStore<PostGisConnectionParameters> {

    public VectorDataStore(String name, PostGisConnectionParameters connectionParameters) {
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
