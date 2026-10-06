package ru.mycrg.data_service_contract.queue.request.gpkg;

import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.INTEGRATION_TO_DATA_QUEUE;

public class ImportGpkgClearTemplatesEvent extends DefaultMessageBusRequestEvent {

    private String dbName;
    private String schema;
    private UUID fileId;
    private boolean keepSourceFile;

    public ImportGpkgClearTemplatesEvent() {
        super(UUID.randomUUID(), INTEGRATION_TO_DATA_QUEUE);
    }

    public ImportGpkgClearTemplatesEvent(String dbName, String schema, UUID fileId) {
        this(dbName, schema, fileId, false);
    }

    public ImportGpkgClearTemplatesEvent(String dbName, String schema, UUID fileId, boolean keepSourceFile) {
        super(UUID.randomUUID(), INTEGRATION_TO_DATA_QUEUE);

        this.dbName = dbName;
        this.schema = schema;
        this.fileId = fileId;
        this.keepSourceFile = keepSourceFile;
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

    public boolean isKeepSourceFile() {
        return keepSourceFile;
    }

    public void setKeepSourceFile(boolean keepSourceFile) {
        this.keepSourceFile = keepSourceFile;
    }
}
