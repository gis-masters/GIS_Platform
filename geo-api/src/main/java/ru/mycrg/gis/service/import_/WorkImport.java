package ru.mycrg.gis.service.import_;

import java.util.List;

public class WorkImport {

    private String targetSchema;
    private List<ImportTask> importTasks;

    public WorkImport() {}

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
