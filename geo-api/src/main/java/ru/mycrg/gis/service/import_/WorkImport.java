package ru.mycrg.gis.service.import_;

import ru.mycrg.gis.dto.BaseRequest;

import java.util.List;

public class WorkImport extends BaseRequest {

    private List<ImportTask> importTasks;

    public WorkImport() {}

    public List<ImportTask> getImportTasks() {
        return importTasks;
    }

    public void setImportTasks(List<ImportTask> importTasks) {
        this.importTasks = importTasks;
    }
}
