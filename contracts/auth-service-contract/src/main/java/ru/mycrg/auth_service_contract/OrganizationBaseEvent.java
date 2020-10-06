package ru.mycrg.auth_service_contract;

public abstract class OrganizationBaseEvent implements IOrganizationEvent {

    private Long orgId;
    private String token;

    public OrganizationBaseEvent() {
    }

    public OrganizationBaseEvent(Long orgId, String token) {
        this.orgId = orgId;
        this.token = token;
    }

    @Override
    public Long getOrgId() {
        return orgId;
    }

    public void setOrgId(Long orgId) {
        this.orgId = orgId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
