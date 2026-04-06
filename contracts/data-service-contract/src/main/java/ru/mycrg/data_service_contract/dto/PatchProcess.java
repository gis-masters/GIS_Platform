package ru.mycrg.data_service_contract.dto;

import ru.mycrg.data_service_contract.enums.ProcessStatus;

import jakarta.validation.constraints.NotNull;

public class PatchProcess {

    @NotNull
    private ProcessStatus status;

    @NotNull
    private Object details;

    public PatchProcess() {
    }

    public PatchProcess(ProcessStatus status, Object details) {
        this.status = status;
        this.details = details;
    }

    public ProcessStatus getStatus() {
        return status;
    }

    public void setStatus(ProcessStatus status) {
        this.status = status;
    }

    public Object getDetails() {
        return details;
    }

    public void setDetails(Object details) {
        this.details = details;
    }
}
