package ru.mycrg.auth_service_contract;

public abstract class OrganizationBaseEvent implements IOrganizationEvent {

    private Long orgId;

    public OrganizationBaseEvent() {
    }

    public OrganizationBaseEvent(Long orgId) {
        this.orgId = orgId;
    }

    @Override
    public Long getOrgId() {
        return orgId;
    }

    public void setOrgId(Long orgId) {
        this.orgId = orgId;
    }

}
