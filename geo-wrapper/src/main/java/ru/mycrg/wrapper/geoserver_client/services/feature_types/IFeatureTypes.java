package ru.mycrg.wrapper.geoserver_client.services.feature_types;

import ru.mycrg.wrapper.geoserver_client.exceptions.GeoserverClientException;

public interface IFeatureTypes {

    void create(String workspaceName, String dataStoreName, String featureName, String jwtToken) throws GeoserverClientException;

    void delete(String workspaceName, String dataStoreName, String featureName, String jwtToken) throws GeoserverClientException;

}
