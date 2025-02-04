package ru.mycrg.data_service.dto;

import javax.validation.constraints.Size;

public class LibraryUpdateDto {

    @Size(max = 255)
    private String title;

    @Size(max = 1024)
    private String details;

    private Boolean versioned;

    private Boolean readyForFts;

    public LibraryUpdateDto() {
        // Required
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public Boolean isVersioned() {
        return versioned;
    }

    public void setVersioned(boolean versioned) {
        this.versioned = versioned;
    }

    public Boolean isReadyForFts() {
        return readyForFts;
    }

    public void setReadyForFts(boolean readyForFts) {
        this.readyForFts = readyForFts;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
