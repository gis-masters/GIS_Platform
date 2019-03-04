package ru.mycrg.gis.service.import_;

import ru.mycrg.common.enums.ProcessStatus;

public class ProcessTask {

    private ImportTask importTask;
    private ProcessStatus status;

    public ProcessTask(ImportTask importTask) {
        this.importTask = importTask;
    }

    public ImportTask getImportTask() {
        return importTask;
    }

    public ProcessStatus getStatus() {
        return status;
    }
}
