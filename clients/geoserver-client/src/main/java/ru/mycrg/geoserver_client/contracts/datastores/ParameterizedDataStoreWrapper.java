package ru.mycrg.geoserver_client.contracts.datastores;

public class ParameterizedDataStoreWrapper {

    public final BaseParameterizedDataStore<?> dataStore;

    public ParameterizedDataStoreWrapper(BaseParameterizedDataStore dataStore) {
        this.dataStore = dataStore;
    }

    public BaseParameterizedDataStore<?> getDataStore() {
        return dataStore;
    }
}
