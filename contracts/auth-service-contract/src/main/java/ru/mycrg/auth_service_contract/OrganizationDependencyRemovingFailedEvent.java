package ru.mycrg.auth_service_contract;

public class OrganizationDependencyRemovingFailedEvent extends OrganizationBaseEvent {

    public OrganizationDependencyRemovingFailedEvent() {
        super();
    }

    public OrganizationDependencyRemovingFailedEvent(IOrganizationEvent event) {
        super(event.getOrgId(), event.getToken());
    }

}
