package ru.mycrg.auth_service_contract.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class OrganizationIntentDto {

    @Email
    @NotBlank
    @Size(max = 60, message = "Не более 60 символов")
    private String email;

    @Min(1)
    private Integer specializationId;

    public OrganizationIntentDto() {
        // Required
    }

    public OrganizationIntentDto(String email, Integer specializationId) {
        this.email = email;
        this.specializationId = specializationId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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
                "\"email\":" + (email == null ? "null" : "\"" + email + "\"") + ", " +
                "\"specializationId\":" + (specializationId == null ? "null" : "\"" + specializationId + "\"") +
                "}";
    }
}
