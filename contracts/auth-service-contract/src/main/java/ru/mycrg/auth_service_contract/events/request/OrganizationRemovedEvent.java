package ru.mycrg.auth_service_contract.events.request;

import java.util.List;

public class OrganizationRemovedEvent extends OrganizationBaseRequestEvent {

    List<String> geoserverLogins;

    public OrganizationRemovedEvent() {
        super();
    }

    public OrganizationRemovedEvent(Long orgId, String token, List<String> geoserverLogins) {
        super(orgId, token, null);

        this.geoserverLogins = geoserverLogins;
    }

    public List<String> getGeoserverLogins() {
        return geoserverLogins;
    }
}
