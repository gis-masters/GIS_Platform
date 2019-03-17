package ru.mycrg.gis.dto;

import ru.mycrg.common.enums.ProcessStatus;
import ru.mycrg.gis.enums.ProcessType;

public class ProcessDto {

    private ProcessType type;
    private ProcessStatus status;

    public ProcessDto() {}

    public ProcessDto(ProcessType type, ProcessStatus status) {
        this.type = type;
        this.status = status;
    }

    public ProcessType getType() {
        return type;
    }

    public void setType(ProcessType type) {
        this.type = type;
    }

    public ProcessStatus getStatus() {
        return status;
    }

    public void setStatus(ProcessStatus status) {
        this.status = status;
    }
}
