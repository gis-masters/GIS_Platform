package ru.mycrg.geoserver_client.services.feature_types;

import ru.mycrg.geoserver_client.exceptions.GeoserverClientException;

public interface IFeatureTypes {

    void create(String workspaceName, String dataStoreName, String featureName, String jwtToken, Integer srs)
            throws GeoserverClientException;

    void delete(String workspaceName, String dataStoreName, String featureName, String jwtToken)
            throws GeoserverClientException;

}
