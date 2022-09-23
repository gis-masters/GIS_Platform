package ru.mycrg.geoserver_client.contracts.datastores;

public class BaseParameterizedDataStore<T> extends BaseDataStore {

    protected T connectionParameters;

    public BaseParameterizedDataStore(String name, T connectionParameters) {
        super(name);

        this.connectionParameters = connectionParameters;
    }

    public T getConnectionParameters() {
        return this.connectionParameters;
    }

    public void setConnectionParameters(T connectionParameters) {
        this.connectionParameters = connectionParameters;
    }
}
