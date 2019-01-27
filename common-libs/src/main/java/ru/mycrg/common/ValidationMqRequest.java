package ru.mycrg.common;

import java.util.UUID;

public class ValidationMqRequest {

    private UUID id;
    private String dbName;
    private String schemaName;
    private EntityTypeDto entityType;

    public ValidationMqRequest() {}

    public ValidationMqRequest(UUID id, String dbName, String schemaName, EntityTypeDto entityType) {
        this.id = id;
        this.dbName = dbName;
        this.schemaName = schemaName;
        this.entityType = entityType;
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
}
