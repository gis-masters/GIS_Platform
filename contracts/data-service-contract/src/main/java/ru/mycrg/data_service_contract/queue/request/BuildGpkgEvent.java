package ru.mycrg.data_service_contract.queue.request;

import ru.mycrg.data_service_contract.dto.ExportProcessModel;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.INTEGRATION_TO_GEO_WRAPPER_QUEUE;

public class BuildGpkgEvent extends DefaultMessageBusRequestEvent {

    private Long processId;
    private String businessKey;
    private String dbName;
    private ExportProcessModel payload;

    public BuildGpkgEvent() {
        super();
    }

    public BuildGpkgEvent(String businessKey, String dbName, ExportProcessModel payload) {
        super(UUID.randomUUID(), INTEGRATION_TO_GEO_WRAPPER_QUEUE);

        this.businessKey = businessKey;
        this.dbName = dbName;
        this.payload = payload;
    }

    public Long getProcessId() {
        return processId;
    }

    public void setProcessId(Long processId) {
        this.processId = processId;
    }

    public String getBusinessKey() {
        return businessKey;
    }

    public void setBusinessKey(String businessKey) {
        this.businessKey = businessKey;
    }

    public String getDbName() {
        return dbName;
    }

    public void setDbName(String dbName) {
        this.dbName = dbName;
    }

    public ExportProcessModel getPayload() {
        return payload;
    }

    public void setPayload(ExportProcessModel payload) {
        this.payload = payload;
    }
}
