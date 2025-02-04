package ru.mycrg.data_service_contract.queue.request;

import ru.mycrg.data_service_contract.dto.ValidationProcessModel;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.FANOUT_VALIDATION_START;
import static ru.mycrg.messagebus_contract.MessageBusProperties.KEY_VALIDATION_START;

public class ValidationRequestEvent extends DefaultMessageBusRequestEvent {

    private Long processId;
    private String dbName;
    private ValidationProcessModel payload;

    public ValidationRequestEvent() {
        super();
    }

    public ValidationRequestEvent(Long processId, String dbName, ValidationProcessModel payload) {
        super(UUID.randomUUID(), FANOUT_VALIDATION_START, KEY_VALIDATION_START);

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

    public ValidationProcessModel getPayload() {
        return payload;
    }

    public void setPayload(ValidationProcessModel payload) {
        this.payload = payload;
    }
}
