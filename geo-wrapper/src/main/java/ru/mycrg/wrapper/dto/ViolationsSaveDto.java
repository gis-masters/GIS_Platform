package ru.mycrg.wrapper.dto;

import org.jetbrains.annotations.NotNull;
import ru.mycrg.common.ObjectValidationResult;
import ru.mycrg.common.ValidationMqRequest;

import java.util.ArrayList;
import java.util.List;

public class ViolationsSaveDto {

    private String dbName;
    private String schemaName;
    private String tableName;
    private List<ObjectValidationResult> violationResults = new ArrayList<>();

    public ViolationsSaveDto() {}

    public ViolationsSaveDto(String dbName, String schemaName, String tableName, List<ObjectValidationResult> violationResults) {
        this.dbName = dbName;
        this.schemaName = schemaName;
        this.tableName = tableName;
        this.violationResults = violationResults;
    }

    public ViolationsSaveDto(@NotNull ValidationMqRequest request, List<ObjectValidationResult> violationResults) {
        this(request.getDbName(), request.getSchemaName(), request.getTableName(), violationResults);
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

    public List<ObjectValidationResult> getViolationResults() {
        return violationResults;
    }

    public void setViolationResults(List<ObjectValidationResult> violationResults) {
        this.violationResults = violationResults;
    }
}
