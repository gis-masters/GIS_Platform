package ru.mycrg.data_service_contract.queue.request.gpkg;

import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.INTEGRATION_TO_DATA_QUEUE;

public class ImportGpkgAckInfoEvent extends DefaultMessageBusRequestEvent {

    private String businessKey;
    private String dbName;
    private UUID fileId;
    private String sourceSchemaName;
    private String tableName;

    public ImportGpkgAckInfoEvent() {
        super();
    }

    public ImportGpkgAckInfoEvent(String businessKey,
                                  String dbName,
                                  UUID fileId,
                                  String sourceSchemaName,
                                  String tableName) {
        super(UUID.randomUUID(), INTEGRATION_TO_DATA_QUEUE);

        this.businessKey = businessKey;
        this.dbName = dbName;
        this.fileId = fileId;
        this.sourceSchemaName = sourceSchemaName;
        this.tableName = tableName;
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

    public UUID getFileId() {
        return fileId;
    }

    public void setFileId(UUID fileId) {
        this.fileId = fileId;
    }

    public String getSourceSchemaName() {
        return sourceSchemaName;
    }

    public void setSourceSchemaName(String sourceSchemaName) {
        this.sourceSchemaName = sourceSchemaName;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }
}
