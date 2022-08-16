package ru.mycrg.data_service.service.import_.dto;

import javax.validation.constraints.NotNull;
import java.util.UUID;

public class ImportSource {

    @NotNull
    private String libraryId;

    @NotNull
    private Long objectId;

    private UUID fileId;

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

    public UUID getFileId() {
        return fileId;
    }

    public void setFileId(UUID fileId) {
        this.fileId = fileId;
    }

    @Override
    public String toString() {
        return "{" +
                "\"libraryId\":" + (libraryId == null ? "null" : "\"" + libraryId + "\"") + ", " +
                "\"objectId\":" + (objectId == null ? "null" : "\"" + objectId + "\"") + ", " +
                "\"fileId\":" + (fileId == null ? "null" : fileId) +
                "}";
    }
}
