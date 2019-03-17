package ru.mycrg.common;

import ru.mycrg.common.enums.RequestType;

import java.util.UUID;

public class ValidationMqRequest {

    private UUID id;
    private String dbName;
    private String schemaName;
    private String tableName;
    private EntityTypeDto entityType;
    private RequestType type;
    private int page = 0;
    private int size = 25;

    public ValidationMqRequest() {}

    public ValidationMqRequest(UUID id, RequestType type, int page, int size,
                               String dbName, String schemaName, EntityTypeDto entityType) {
        this.id = id;
        this.type = type;
        this.page = page;
        this.size = size;
        this.dbName = dbName;
        this.schemaName = schemaName;
        this.entityType = entityType;
        this.tableName = entityType.getTableName();

    }

    public String getDbName() {
        return dbName;
    }

    public void setDbName(String dbName) {
        this.dbName = dbName;
    }

    public String getSchemaName() {
        return schemaName;
    }

    public void setSchemaName(String schemaName) {
        this.schemaName = schemaName;
    }

    public EntityTypeDto getEntityType() {
        return entityType;
    }

    public void setEntityType(EntityTypeDto entityType) {
        this.entityType = entityType;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public RequestType getType() {
        return type;
    }

    public void setType(RequestType type) {
        this.type = type;
    }
}
