package ru.mycrg.wrapper.geoserver_client.services.organization;

import ru.mycrg.common.OrgMqProcessRequest;
import ru.mycrg.wrapper.geoserver_client.exceptions.GeoserverClientException;

public interface IOrganization {
    void create(OrgMqProcessRequest dto) throws GeoserverClientException;
}
