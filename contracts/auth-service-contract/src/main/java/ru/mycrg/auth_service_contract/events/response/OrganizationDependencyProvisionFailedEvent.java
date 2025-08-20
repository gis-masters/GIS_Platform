package ru.mycrg.auth_service_contract.events.response;

import ru.mycrg.auth_service_contract.events.request.OrganizationInitializedEvent;

public class OrganizationDependencyProvisionFailedEvent extends OrganizationBaseResponseEvent {

    public OrganizationDependencyProvisionFailedEvent() {
        super();
    }

    public OrganizationDependencyProvisionFailedEvent(OrganizationInitializedEvent event) {
        super(event, event.getOrgId(), event.getRootToken());
    }
}
