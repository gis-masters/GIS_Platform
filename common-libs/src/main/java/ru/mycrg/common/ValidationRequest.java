package ru.mycrg.common;

public class ValidationRequest {

    private String dbName;
    private String schemaName;
    private EntityTypeDto entityType;

    public ValidationRequest() {}

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
}
