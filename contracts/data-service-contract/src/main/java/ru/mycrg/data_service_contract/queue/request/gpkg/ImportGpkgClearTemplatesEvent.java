package ru.mycrg.data_service_contract.queue.request.gpkg;

import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.INTEGRATION_TO_DATA_QUEUE;

public class ImportGpkgClearTemplatesEvent extends DefaultMessageBusRequestEvent {

    private String dbName;
    private String schema;
    private UUID fileId;

    public ImportGpkgClearTemplatesEvent() {
        super(UUID.randomUUID(), INTEGRATION_TO_DATA_QUEUE);
    }

    public ImportGpkgClearTemplatesEvent(String dbName, String schema, UUID fileId) {
        super(UUID.randomUUID(), INTEGRATION_TO_DATA_QUEUE);

        this.dbName = dbName;
        this.schema = schema;
        this.fileId = fileId;
    }

    public String getDbName() {
        return dbName;
    }

    public void setDbName(String dbName) {
        this.dbName = dbName;
    }

    public String getSchema() {
        return schema;
    }

    public void setSchema(String schema) {
        this.schema = schema;
    }

    public UUID getFileId() {
        return fileId;
    }

    public void setFileId(UUID fileId) {
        this.fileId = fileId;
    }
}
