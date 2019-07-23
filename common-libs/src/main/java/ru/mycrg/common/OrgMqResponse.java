package ru.mycrg.common;

public class OrgMqResponse {

    private Long orgId;

    public OrgMqResponse() {}

    public OrgMqResponse(long orgId) {
        this.orgId = orgId;
    }

    public Long getOrgId() {
        return orgId;
    }

    public void setOrgId(Long orgId) {
        this.orgId = orgId;
    }
}
