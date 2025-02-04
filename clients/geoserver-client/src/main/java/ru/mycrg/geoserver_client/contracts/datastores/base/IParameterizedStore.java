package ru.mycrg.geoserver_client.contracts.datastores.base;

public interface IParameterizedStore<T> {

    T getConnectionParameters();
}
