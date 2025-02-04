package ru.mycrg.data_service.dto;

import javax.validation.constraints.NotEmpty;
import java.util.List;

public class WorkImport extends BaseRequest {

    @NotEmpty
    private List<ImportTask> importTasks;

    public WorkImport() {
        // Framework required
    }

    public List<ImportTask> getImportTasks() {
        return importTasks;
    }

    public void setImportTasks(List<ImportTask> importTasks) {
        this.importTasks = importTasks;
    }
}
