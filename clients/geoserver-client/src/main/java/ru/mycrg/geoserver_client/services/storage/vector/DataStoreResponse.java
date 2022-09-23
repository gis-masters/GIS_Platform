package ru.mycrg.geoserver_client.services.storage.vector;

public class DataStoreResponse {

    private DataStoreWrapper dataStores;

    public DataStoreResponse() {
        // Required
    }

    public DataStoreWrapper getDataStores() {
        return dataStores;
    }

    public void setDataStores(DataStoreWrapper dataStores) {
        this.dataStores = dataStores;
    }
}
