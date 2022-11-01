package ru.mycrg.data_service_contract.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class ResourceProjection {

    private String dbName;
    private String schemaName;
    private String tableName;
    private SchemaDto schema;
    private String crs;
    private String type;

    public ResourceProjection() {
        // Required
    }

    public ResourceProjection(String dbName, String schemaName, String tableName) {
        this(dbName, schemaName, tableName, null, null, "objectCollection");
    }

    public ResourceProjection(String dbName, String schemaName, String tableName, SchemaDto schema) {
        this(dbName, schemaName, tableName, schema, null, "objectCollection");
    }

    public ResourceProjection(String dbName, String schemaName, String tableName, SchemaDto schema, String crs) {
        this(dbName, schemaName, tableName, schema, crs, null);
    }

    public ResourceProjection(String dbName, String schemaName, String tableName, SchemaDto schema, String crs,
                              String type) {
        this.dbName = dbName;
        this.schemaName = schemaName;
        this.tableName = tableName;
        this.schema = schema;
        this.crs = crs;
        this.type = type;
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

    public String getCrs() {
        return crs;
    }

    public void setCrs(String crs) {
        this.crs = crs;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return getResourceId();
    }
}
