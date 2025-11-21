package ru.mycrg.messagebus_contract.events.integration_wrapper;

import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.INTEGRATION_TO_GEO_WRAPPER_QUEUE;

//пакет не тот как будто бы
public class ExtractGpkgEvent extends DefaultMessageBusRequestEvent {

    private String dbName;
    private UUID fileId;
    private String businessKey;

    public ExtractGpkgEvent() {
        super();
    }

    public ExtractGpkgEvent(String dbName,
                            UUID fileId,
                            String businessKey) {
        super(UUID.randomUUID(), INTEGRATION_TO_GEO_WRAPPER_QUEUE);

        this.dbName = dbName;
        this.fileId = fileId;
        this.businessKey = businessKey;
    }

    public String getDbName() {
        return dbName;
    }

    public void setDbName(String dbName) {
        this.dbName = dbName;
    }

    public UUID getFileId() {
        return fileId;
    }

    public void setFileId(UUID fileId) {
        this.fileId = fileId;
    }

    public String getBusinessKey() {
        return businessKey;
    }

    public void setBusinessKey(String businessKey) {
        this.businessKey = businessKey;
    }
}
