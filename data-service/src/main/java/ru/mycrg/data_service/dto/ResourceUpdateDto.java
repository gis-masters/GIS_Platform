package ru.mycrg.data_service.dto;

import javax.validation.constraints.Size;

public class ResourceUpdateDto {

    @Size(max = 250, message = "Не должно превышать 250 символов")
    private String title;

    @Size(max = 1000, message = "Не должно превышать 1000 символов")
    private String details;

    public ResourceUpdateDto() {
    }

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
