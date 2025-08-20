package ru.mycrg.geoserver_client.services.storage.vector;

import ru.mycrg.geoserver_client.contracts.NameHrefProjection;

import java.util.ArrayList;
import java.util.List;

public class DataStoreWrapper {

    private List<NameHrefProjection> dataStore = new ArrayList<>();

    public DataStoreWrapper() {
        // Required
    }

    public List<NameHrefProjection> getDataStore() {
        return dataStore;
    }

    public void setDataStore(List<NameHrefProjection> dataStore) {
        this.dataStore = dataStore;
    }
}
