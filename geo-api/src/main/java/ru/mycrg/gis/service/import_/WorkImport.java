package ru.mycrg.gis.service.import_;

import ru.mycrg.gis.dto.BaseRequest;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

public class WorkImport extends BaseRequest {

    @NotEmpty
    private List<ImportTask> importTasks;

    public WorkImport() {}

    public List<ImportTask> getImportTasks() {
        return importTasks;
    }

    public void setImportTasks(List<ImportTask> importTasks) {
        this.importTasks = importTasks;
    }
}
