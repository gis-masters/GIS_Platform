package ru.mycrg.acceptance.auth_service.dto;

/**
 * DTO для тестирования создания организации с именованными полями из Cucumber DataTable
 */
public class OrganizationTestDto {

    private String name;
    private String phone;
    private String ownerSurname;
    private String ownerName;
    private String ownerEmail;
    private String ownerPassword;
    private String specializationId;
    private String description;

    public OrganizationTestDto() {
    }

    public OrganizationTestDto(String name,
                               String phone,
                               String ownerSurname,
                               String ownerName,
                               String ownerEmail,
                               String ownerPassword,
                               String specializationId,
                               String description) {
        this.name = name;
        this.phone = phone;
        this.ownerSurname = ownerSurname;
        this.ownerName = ownerName;
        this.ownerEmail = ownerEmail;
        this.ownerPassword = ownerPassword;
        this.specializationId = specializationId;
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

    public String getOwnerSurname() {
        return ownerSurname;
    }

    public void setOwnerSurname(String ownerSurname) {
        this.ownerSurname = ownerSurname;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getOwnerEmail() {
        return ownerEmail;
    }

    public void setOwnerEmail(String ownerEmail) {
        this.ownerEmail = ownerEmail;
    }

    public String getOwnerPassword() {
        return ownerPassword;
    }

    public void setOwnerPassword(String ownerPassword) {
        this.ownerPassword = ownerPassword;
    }

    public String getSpecializationId() {
        return specializationId;
    }

    public void setSpecializationId(String specializationId) {
        this.specializationId = specializationId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
