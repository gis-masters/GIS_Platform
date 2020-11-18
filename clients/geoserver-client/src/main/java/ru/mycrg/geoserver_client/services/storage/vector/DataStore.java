package ru.mycrg.geoserver_client.services.storage.vector;

public class DataStore {

    public final String name;
    public final ConnectionParameters connectionParameters;

    public DataStore(String name, ConnectionParameters connectionParameters) {
        this.name = name;
        this.connectionParameters = connectionParameters;
    }

    public String getName() {
        return name;
    }

    public ConnectionParameters getConnectionParameters() {
        return connectionParameters;
    }
}
