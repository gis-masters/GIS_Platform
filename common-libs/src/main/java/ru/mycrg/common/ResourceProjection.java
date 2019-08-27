package ru.mycrg.common;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class ResourceProjection {

    private String dbName;
    private String schemaName;
    private String tableName;
    private String sridCode;

    public ResourceProjection() {}

    public ResourceProjection(String dbName, String schemaName, String tableName) {
        this.dbName = dbName;
        this.schemaName = schemaName;
        this.tableName = tableName;
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

    public String getSridCode() {
        return sridCode;
    }

    public void setSridCode(String sridCode) {
        this.sridCode = sridCode;
    }

    @Override
    public String toString() {
        return getResourceId();
    }
}
