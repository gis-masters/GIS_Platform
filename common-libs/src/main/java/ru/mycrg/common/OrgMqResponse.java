package ru.mycrg.common;

import ru.mycrg.common.enums.ProcessStatus;

import java.io.Serializable;

public class OrgMqResponse extends BaseMqProcessResponse implements Serializable {

    private Long orgId;

    public OrgMqResponse() {}

    public OrgMqResponse(OrgMqProcessRequest request, ProcessStatus status) {
        super(request.getId(), request.getType(), status);

        this.orgId = request.getOrgId();
    }

    public Long getOrgId() {
        return orgId;
    }

}
