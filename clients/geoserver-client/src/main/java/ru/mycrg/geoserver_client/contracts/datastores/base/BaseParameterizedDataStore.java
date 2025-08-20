package ru.mycrg.geoserver_client.contracts.datastores.base;

public class BaseParameterizedDataStore<T> implements IParameterizedStore<T> {

    protected String name;
    protected T connectionParameters;

    public BaseParameterizedDataStore(String name, T connectionParameters) {
        this.name = name;
        this.connectionParameters = connectionParameters;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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
                "\"name\":" + (name == null ? "null" : "\"" + name + "\"") + ", " +
                "\"connectionParameters\":" + (connectionParameters == null ? "null" : connectionParameters) +
                "}";
    }
}
