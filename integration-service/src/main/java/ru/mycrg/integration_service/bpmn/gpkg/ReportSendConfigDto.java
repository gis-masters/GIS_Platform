package ru.mycrg.integration_service.bpmn.gpkg;

import ru.mycrg.data_service_contract.enums.ProcessStatus;

public class ReportSendConfigDto {

    private Long processId;
    private String dbName;
    private String businessKey;
    private ProcessStatus processStatus;

    public ReportSendConfigDto() {
    }

    public ReportSendConfigDto(Long processId, String dbName, String businessKey, ProcessStatus processStatus) {
        this.processId = processId;
        this.dbName = dbName;
        this.businessKey = businessKey;
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

    public String getBusinessKey() {
        return businessKey;
    }

    public void setBusinessKey(String businessKey) {
        this.businessKey = businessKey;
    }

    public ProcessStatus getProcessStatus() {
        return processStatus;
    }

    public void setProcessStatus(ProcessStatus processStatus) {
        this.processStatus = processStatus;
    }
}
