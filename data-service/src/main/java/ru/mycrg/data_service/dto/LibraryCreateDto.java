package ru.mycrg.data_service.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class LibraryCreateDto {

    @Size(max = 1024)
    private String details;

    @NotBlank
    @Size(max = 50)
    private String schemaId;
    private boolean versioned = false;
    private boolean readyForFts = true;

    public LibraryCreateDto() {
        // Required
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public String getSchemaId() {
        return schemaId;
    }

    public void setSchemaId(String schemaId) {
        this.schemaId = schemaId;
    }

    public boolean isVersioned() {
        return versioned;
    }

    public void setVersioned(boolean versioned) {
        this.versioned = versioned;
    }

    public boolean isReadyForFts() {
        return readyForFts;
    }

    public void setReadyForFts(boolean readyForFts) {
        this.readyForFts = readyForFts;
    }
}
