package ru.mycrg.geoserver_client.services.storage.vector;

public class DataStoreModel {
    public final DataStore dataStore;

    public DataStoreModel(DataStore dataStore) {
        this.dataStore = dataStore;
    }

    public DataStore getDataStore() {
        return dataStore;
    }
}
