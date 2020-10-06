package ru.mycrg.auth_service_contract;

public class OrganizationDependencyRemovingSucceededEvent extends OrganizationBaseEvent {

    public OrganizationDependencyRemovingSucceededEvent() {
        super();
    }

    public OrganizationDependencyRemovingSucceededEvent(IOrganizationEvent event) {
        super(event.getOrgId(), event.getToken());
    }

}
