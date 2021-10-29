package ru.mycrg.data_service.service.import_.model;

import ru.mycrg.data_service_contract.dto.ImportReport;
import ru.mycrg.data_service_contract.enums.ProcessStatus;

import java.util.UUID;

public class WsImportModel {

    private final UUID id;
    private final ProcessStatus status;
    private final ImportReport payload;
    private final String description;
    private final Integer progress;

    public WsImportModel(UUID id, ProcessStatus status, ImportReport payload, String description) {
        this.id = id;
        this.status = status;
        this.payload = payload;
        this.description = description;
        this.progress = null;
    }

    public UUID getId() {
        return id;
    }

    public ProcessStatus getStatus() {
        return status;
    }

    public ImportReport getPayload() {
        return payload;
    }

    public String getDescription() {
        return description;
    }

    public Integer getProgress() {
        return progress;
    }
}
