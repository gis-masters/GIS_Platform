package ru.mycrg.geoserver_client.services.feature_types;

import ru.mycrg.http_client.exceptions.HttpClientException;

public interface IFeatureTypes {

    void create(String workspaceName, String dataStoreName, String featureName, Integer srs) throws HttpClientException;

    void delete(String workspaceName, String dataStoreName, String featureName) throws HttpClientException;
}
