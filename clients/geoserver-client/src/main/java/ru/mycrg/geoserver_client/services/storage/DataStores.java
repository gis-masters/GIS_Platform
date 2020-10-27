package ru.mycrg.geoserver_client.services.storage;

import java.util.ArrayList;
import java.util.List;

public class DataStores {

    private List<NameHrefProjection> dataStore = new ArrayList<>();

    public DataStores() {
    }

    public List<NameHrefProjection> getDataStore() {
        return dataStore;
    }

    public void setDataStore(List<NameHrefProjection> dataStore) {
        this.dataStore = dataStore;
    }
}
