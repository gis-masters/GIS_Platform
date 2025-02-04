package ru.mycrg.data_service_contract.queue.request;

import ru.mycrg.data_service_contract.dto.ExportProcessModel;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.FANOUT_EXPORT_INIT;
import static ru.mycrg.messagebus_contract.MessageBusProperties.KEY_EXPORT_INIT;

public class ExportRequestEvent extends DefaultMessageBusRequestEvent {

    private Long processId;
    private String dbName;
    private ExportProcessModel payload;

    public ExportRequestEvent() {
        super();
    }

    public ExportRequestEvent(Long processId, String dbName, ExportProcessModel payload) {
        super(UUID.randomUUID(), FANOUT_EXPORT_INIT, KEY_EXPORT_INIT);

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

    public ExportProcessModel getPayload() {
        return payload;
    }

    public void setPayload(ExportProcessModel payload) {
        this.payload = payload;
    }
}
