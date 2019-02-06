package ru.mycrg.gis.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class OrganizationUpdateDto {

    @NotBlank(message = "Please provide organization name")
    @Size(min=5, max=500, message = "No less 5 and no more than 500 characters")
    private String name;

    @NotBlank(message = "Please provide phone")
    private String phone;

    public OrganizationUpdateDto(String name, String phone) {
        this.name = name;
        this.phone = phone;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

}
