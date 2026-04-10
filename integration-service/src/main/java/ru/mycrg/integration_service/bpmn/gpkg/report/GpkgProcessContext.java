package ru.mycrg.integration_service.bpmn.gpkg.report;

import ru.mycrg.data_service_contract.enums.ProcessStatus;

public class GpkgProcessContext {

    private Long processId;
    private String dbName;
    private ProcessStatus processStatus;

    public GpkgProcessContext() {
    }

    public GpkgProcessContext(Long processId, String dbName, ProcessStatus processStatus) {
        this.processId = processId;
        this.dbName = dbName;
        this.processStatus = processStatus;
    }

    public Long getProcessId() {
        return processId;
    }

    public void setProcessId(Long processId) {
        this.processId = processId;
    }

    public String getDbName() {
        return dbName;
    }

    public void setDbName(String dbName) {
        this.dbName = dbName;
    }

    public ProcessStatus getProcessStatus() {
        return processStatus;
    }

    public void setProcessStatus(ProcessStatus processStatus) {
        this.processStatus = processStatus;
    }
}
