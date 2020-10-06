package ru.mycrg.auth_service_contract;

public class OrganizationDependencyProvisionFailedEvent extends OrganizationBaseEvent {

    public OrganizationDependencyProvisionFailedEvent() {
        super();
    }

    public OrganizationDependencyProvisionFailedEvent(IOrganizationEvent event) {
        super(event.getOrgId(), event.getToken());
    }

}
