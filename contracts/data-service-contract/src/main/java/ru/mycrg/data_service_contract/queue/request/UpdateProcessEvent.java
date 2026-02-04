package ru.mycrg.data_service_contract.queue.request;

import ru.mycrg.data_service_contract.dto.PatchProcess;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.INTEGRATION_TO_DATA_QUEUE;

public class UpdateProcessEvent extends DefaultMessageBusRequestEvent {

    private Long processId;
    private String dbName;
    private PatchProcess payload;

    public UpdateProcessEvent() {
        super();
    }

    public UpdateProcessEvent(Long processId, String dbName, PatchProcess payload) {
        super(UUID.randomUUID(), INTEGRATION_TO_DATA_QUEUE);

        this.processId = processId;
        this.dbName = dbName;
        this.payload = payload;
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

    public PatchProcess getPayload() {
        return payload;
    }

    public void setPayload(PatchProcess payload) {
        this.payload = payload;
    }
}
