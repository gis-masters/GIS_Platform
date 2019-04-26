package ru.mycrg.common;

import ru.mycrg.common.enums.ProcessStatus;
import ru.mycrg.common.enums.RequestType;

import java.io.Serializable;

public class OrgMqResponse extends BaseMqProcessResponse implements Serializable {

    private Long orgId;
    private ProcessStatus status;

    public OrgMqResponse() {
    }

    public OrgMqResponse(Long id, RequestType type, ProcessStatus status) {
        super(type);

        this.orgId = id;
        this.status = status;
    }

    public Long getOrgId() {
        return orgId;
    }

    public void setOrgId(Long orgId) {
        this.orgId = orgId;
    }

    public ProcessStatus getStatus() {
        return status;
    }

    public void setStatus(ProcessStatus status) {
        this.status = status;
    }
}
