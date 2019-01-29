package ru.mycrg.gis.dto;

import java.util.Objects;

public class ValidationRequestDto {

    private String dbName;
    private String schemaName;
    private String tableName;

    public ValidationRequestDto() {}

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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ValidationRequestDto that = (ValidationRequestDto) o;
        return Objects.equals(dbName, that.dbName) &&
                Objects.equals(schemaName, that.schemaName) &&
                Objects.equals(tableName, that.tableName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(dbName, schemaName, tableName);
    }
}
