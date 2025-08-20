package ru.mycrg.geoserver_client.contracts.datastores.base;

public class ParameterizedDataStoreWrapper {

    private final IParameterizedStore<?> dataStore;

    public ParameterizedDataStoreWrapper(IParameterizedStore<?> dataStore) {
        this.dataStore = dataStore;
    }

    public IParameterizedStore<?> getDataStore() {
        return dataStore;
    }
}
