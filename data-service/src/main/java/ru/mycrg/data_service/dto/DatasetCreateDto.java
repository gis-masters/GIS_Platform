package ru.mycrg.data_service.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

public class DatasetCreateDto {

    @NotBlank
    @Size(min = 3, max = 60)
    @Pattern(regexp = "^[^\\d][a-zA-z0-9_$]*$", message = "Имя некорректно")
    private String name;

    @NotBlank
    @Size(max = 250)
    private String title;

    @Size(max = 1000)
    private String details;

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
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
