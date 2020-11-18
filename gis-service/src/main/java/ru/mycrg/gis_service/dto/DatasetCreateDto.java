package ru.mycrg.gis_service.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class DatasetCreateDto {

    @NotBlank
    @Size(max = 250)
    private String title;

    @Size(max = 1000)
    private String details;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }
}
