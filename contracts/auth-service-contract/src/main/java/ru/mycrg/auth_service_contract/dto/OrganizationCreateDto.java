package ru.mycrg.auth_service_contract.dto;

import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class OrganizationCreateDto {

    @NotBlank(message = "Please provide organization name")
    @Size(min = 5, max = 500, message = "No less 5 and no more than 500 characters")
    private String name;

    @NotBlank(message = "Please provide phone")
    @Size(max = 20, message = "No more than 20 characters")
    private String phone;

    @Size(max = 2000, message = "No more than 2000 characters")
    private String description;

    @Min(1)
    private Integer specializationId;

    @Valid
    @NotNull
    private UserCreateDto owner;

    public OrganizationCreateDto() {
        // Required
    }

    public OrganizationCreateDto(String name, String phone, UserCreateDto owner) {
        this.name = name;
        this.phone = phone;
        this.owner = owner;
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

    public UserCreateDto getOwner() {
        return owner;
    }

    public void setOwner(UserCreateDto owner) {
        this.owner = owner;
    }

    public Integer getSpecializationId() {
        return specializationId;
    }

    public void setSpecializationId(Integer specializationId) {
        this.specializationId = specializationId;
    }

    @Override
    public String toString() {
        return "{" +
                "\"name\":" + (name == null ? "null" : "\"" + name + "\"") + ", " +
                "\"phone\":" + (phone == null ? "null" : "\"" + phone + "\"") + ", " +
                "\"specializationId\":" + (specializationId == null ? "null" : "\"" + specializationId + "\"") + ", " +
                "\"description\":" + (description == null ? "null" : "\"" + description + "\"") + ", " +
                "\"owner\":" + (owner == null ? "null" : owner) +
                "}";
    }
}
