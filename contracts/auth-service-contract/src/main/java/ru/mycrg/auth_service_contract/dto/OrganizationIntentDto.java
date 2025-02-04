package ru.mycrg.auth_service_contract.dto;

import javax.validation.constraints.Min;

public class OrganizationIntentDto extends InitPasswordResetDto {

    @Min(1)
    private Integer specializationId;

    public OrganizationIntentDto() {
        // Required
    }

    public OrganizationIntentDto(String origin, String email, Integer specializationId) {
        this.setEmail(email);
        this.setOrigin(origin);

        this.specializationId = specializationId;
    }

    public Integer getSpecializationId() {
        return specializationId;
    }

    public void setSpecializationId(Integer specializationId) {
        this.specializationId = specializationId;
    }
}
