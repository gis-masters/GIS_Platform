package ru.mycrg.acceptance.data_service.processes;

public class ImportSource {

    private String libraryId;
    private Long objectId;

    public ImportSource() {
        // Required
    }

    public ImportSource(String libraryId, Long objectId) {
        this.libraryId = libraryId;
        this.objectId = objectId;
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
