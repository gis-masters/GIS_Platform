package ru.mycrg.geoserver_client.services.organization;

import ru.mycrg.auth_service_contract.OrganizationInitializedEvent;
import ru.mycrg.geoserver_client.exceptions.GeoserverClientException;

public interface IOrganization {
    void create(OrganizationInitializedEvent dto) throws GeoserverClientException;
}
