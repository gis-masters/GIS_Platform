package ru.mycrg.auth_service_contract.dto;

import javax.validation.constraints.Size;

public class OrganizationUpdateDto {

    @Size(min = 5, max = 500, message = "No less 5 and no more than 500 characters")
    private String name;

    @Size(min = 1, max = 20, message = "No less 1 and no more than 20 characters")
    private String phone;

    @Size(max = 2000, message = "No more than 2000 characters")
    private String description;

    public OrganizationUpdateDto() {
        // Required
    }

    public OrganizationUpdateDto(String name, String phone, String description) {
        this.name = name;
        this.phone = phone;
        this.description = description;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "{" +
                "\"name\":" + (name == null ? "null" : "\"" + name + "\"") + ", " +
                "\"phone\":" + (phone == null ? "null" : "\"" + phone + "\"") + ", " +
                "\"description\":" + (description == null ? "null" : "\"" + description + "\"") + ", " +
                "}";
    }
}
