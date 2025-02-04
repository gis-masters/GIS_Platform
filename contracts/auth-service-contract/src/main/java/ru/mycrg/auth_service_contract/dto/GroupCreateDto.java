package ru.mycrg.auth_service_contract.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class GroupCreateDto {

    @NotBlank(message = "Please provide user name")
    @Size(min=3, max=255, message = "No less 3 and no more than 255 characters")
    private String name;

    @Size(min=3, max=255, message = "No less 3 and no more than 255 characters")
    private String description;

    public GroupCreateDto() {
        // Required
    }

    public GroupCreateDto(String name, String description) {
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
