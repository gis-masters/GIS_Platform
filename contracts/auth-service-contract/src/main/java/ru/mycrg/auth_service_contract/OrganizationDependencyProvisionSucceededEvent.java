package ru.mycrg.auth_service_contract;

public class OrganizationDependencyProvisionSucceededEvent extends OrganizationBaseEvent {

    public OrganizationDependencyProvisionSucceededEvent() {
        super();
    }

    public OrganizationDependencyProvisionSucceededEvent(IOrganizationEvent event) {
        super(event.getOrgId(), event.getToken());
    }

}
