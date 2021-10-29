package ru.mycrg.data_service.service.processes.dto;

import javax.validation.constraints.NotNull;

public class ImportSource {

    @NotNull
    private String libraryId;

    @NotNull
    private Long objectId;

    public ImportSource() {
        // Required
    }

    public String getLibraryId() {
        return libraryId;
    }

    public void setLibraryId(String libraryId) {
        this.libraryId = libraryId;
    }

    public Long getObjectId() {
        return objectId;
    }

    public void setObjectId(Long objectId) {
        this.objectId = objectId;
    }
}
