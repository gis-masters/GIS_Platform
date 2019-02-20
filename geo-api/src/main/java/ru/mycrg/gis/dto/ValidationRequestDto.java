package ru.mycrg.gis.dto;

import javax.validation.constraints.NotBlank;
import java.util.Objects;

public class ValidationRequestDto {

    @NotBlank(message = "NotBlank database name")
    private String dbName;

    @NotBlank(message = "NotBlank schema name")
    private String schemaName;

    @NotBlank(message = "NotBlank table name")
    private String tableName;

    public ValidationRequestDto() {}

    public String getResourceId() {
        return String.join(":", dbName, schemaName, tableName);
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
