package ru.mycrg.geoserver_client.contracts.datastores.base;

abstract class BaseDataStore implements IDataStore {

    protected String name;

    public BaseDataStore(String name) {
        this.name = name;
    }

    @Override
    public String getName() {
        return this.name;
    }

    @Override
    public void setName(String name) {
        this.name = name;
    }
}
