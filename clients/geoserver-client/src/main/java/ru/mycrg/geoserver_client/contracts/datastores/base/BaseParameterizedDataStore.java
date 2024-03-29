package ru.mycrg.geoserver_client.contracts.datastores.base;

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

    @Override
    public String toString() {
        return "{" +
                "\"connectionParameters\":" + (connectionParameters == null ? "null" : connectionParameters) + ", " +
                "\"name\":" + (name == null ? "null" : "\"" + name + "\"") +
                "}";
    }
}
