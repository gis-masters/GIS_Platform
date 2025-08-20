package ru.mycrg.auth_service_contract.events.response;

import ru.mycrg.auth_service_contract.events.request.OrganizationRemovedEvent;

public class OrganizationDependencyRemovingSucceededEvent extends OrganizationBaseResponseEvent {

    public OrganizationDependencyRemovingSucceededEvent() {
        super();
    }

    public OrganizationDependencyRemovingSucceededEvent(OrganizationRemovedEvent event) {
        super(event, event.getOrgId(), event.getRootToken());
    }
}
