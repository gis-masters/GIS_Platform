package ru.mycrg.auth_service_contract.dto;

import javax.validation.constraints.Size;

public class GroupUpdateDto {

    @Size(min = 3, max = 255, message = "Не менее 3 символов и не более чем 255 символов")
    private String name;

    @Size(min = 3, max = 255, message = "Не менее 3 символов и не более чем 255 символов")
    private String description;

    public GroupUpdateDto() {
        // Required
    }

    public GroupUpdateDto(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
