package ru.mycrg.auth_service_contract.dto;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class OrganizationCreateDto {

    @NotBlank(message = "Please provide organization name")
    @Size(min=5, max=500, message = "No less 5 and no more than 500 characters")
    private String name;

    @NotBlank(message = "Please provide phone")
    @Size(max = 20, message = "No more than 20 characters")
    private String phone;

    @Valid
    @NotNull
    private UserCreateDto owner;

    public OrganizationCreateDto() {}

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

    public UserCreateDto getOwner() {
        return owner;
    }

    public void setOwner(UserCreateDto owner) {
        this.owner = owner;
    }
}
