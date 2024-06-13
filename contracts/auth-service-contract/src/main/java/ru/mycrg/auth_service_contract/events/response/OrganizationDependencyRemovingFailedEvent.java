package ru.mycrg.auth_service_contract.events.response;

import ru.mycrg.auth_service_contract.events.request.OrganizationRemovedEvent;

public class OrganizationDependencyRemovingFailedEvent extends OrganizationBaseResponseEvent {

    public OrganizationDependencyRemovingFailedEvent() {
        super();
    }

    public OrganizationDependencyRemovingFailedEvent(OrganizationRemovedEvent event) {
        super(event, event.getOrgId(), event.getRootToken());
    }
}
