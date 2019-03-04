package ru.mycrg.common;

public class ResourceProjection {

    private String dbName;
    private String schemaName;
    private String tableName;

    public ResourceProjection() {}

    public ResourceProjection(String dbName, String schemaName, String tableName) {
        this.dbName = dbName;
        this.schemaName = schemaName;
        this.tableName = tableName;
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
}
