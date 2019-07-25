package ru.mycrg.wrapper.geoserver_client.services;

import ru.mycrg.common.OrgMqProcessRequest;
import ru.mycrg.wrapper.geoserver_client.GeoserverClientException;

public interface IOrganization {
    void createOrganization(OrgMqProcessRequest dto) throws GeoserverClientException;
}
