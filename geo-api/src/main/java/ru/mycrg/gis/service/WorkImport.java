package ru.mycrg.gis.service;

import java.util.List;

public class WorkImport {

    private String dbName;
    private String sourceSchema;
    private String targetSchema;
    private List<ImportTask> importTasks;

    public WorkImport() {}

    public WorkImport(String dbName, String sourceSchema, String targetSchema, List<ImportTask> importTasks) {
        this.dbName = dbName;
        this.sourceSchema = sourceSchema;
        this.targetSchema = targetSchema;
        this.importTasks = importTasks;
    }

    public String getDbName() {
        return dbName;
    }

    public void setDbName(String dbName) {
        this.dbName = dbName;
    }

    public String getSourceSchema() {
        return sourceSchema;
    }

    public void setSourceSchema(String sourceSchema) {
        this.sourceSchema = sourceSchema;
    }

    public String getTargetSchema() {
        return targetSchema;
    }

    public void setTargetSchema(String targetSchema) {
        this.targetSchema = targetSchema;
    }

    public List<ImportTask> getImportTasks() {
        return importTasks;
    }

    public void setImportTasks(List<ImportTask> importTasks) {
        this.importTasks = importTasks;
    }
}
