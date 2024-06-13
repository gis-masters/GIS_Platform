package ru.mycrg.auth_service_contract.events.response;

import ru.mycrg.auth_service_contract.events.request.OrganizationInitializedEvent;

public class OrganizationDependencyProvisionSucceededEvent extends OrganizationBaseResponseEvent {

    public OrganizationDependencyProvisionSucceededEvent() {
        super();
    }

    public OrganizationDependencyProvisionSucceededEvent(OrganizationInitializedEvent event) {
        super(event, event.getOrgId(), event.getRootToken());
    }
}
