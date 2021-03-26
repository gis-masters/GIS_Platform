package ru.mycrg.data_service_contract.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class ResourceProjection {

    private String dbName;
    private String schemaName;
    private String tableName;
    private SchemaDto schema;

    public ResourceProjection() {
    }

    public ResourceProjection(String dbName, String schemaName, String tableName) {
        this.dbName = dbName;
        this.schemaName = schemaName;
        this.tableName = tableName;
    }

    public ResourceProjection(String dbName, String schemaName, String tableName, SchemaDto schema) {
        this.dbName = dbName;
        this.schemaName = schemaName;
        this.tableName = tableName;
        this.schema = schema;
    }

    @JsonIgnore
    public String getResourceId() {
        return String.join(".", dbName, schemaName, tableName);
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

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public SchemaDto getSchema() {
        return schema;
    }

    public void setSchema(SchemaDto schema) {
        this.schema = schema;
    }

    @Override
    public String toString() {
        return getResourceId();
    }
}
