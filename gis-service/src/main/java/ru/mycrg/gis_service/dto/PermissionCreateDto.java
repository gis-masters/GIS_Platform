package ru.mycrg.gis_service.dto;

import ru.mycrg.gis_service.entity.Permission;

import javax.validation.constraints.*;

public class PermissionCreateDto {

    @Min(message = "Минимальное допустимое значение 1", value = 1)
    @Max(Long.MAX_VALUE)
    @NotNull
    private Long principalId;

    @NotBlank
    @Pattern(regexp = "^(user|group)$", message = "Допустимые значения поля principalType: user или group")
    private String principalType;

    @NotBlank
    @Pattern(regexp = "^(VIEWER|CONTRIBUTOR|OWNER)$", message = "Допустимые значения поля role: VIEWER, CONTRIBUTOR, OWNER")
    private String role;

    public PermissionCreateDto() {
        //Required by framework
    }

    public PermissionCreateDto(Permission permission) {
        this(permission.getId(), permission.getPrincipalType(), permission.getRole().getName());
    }

    public PermissionCreateDto(Long principalId, String principalType, String role) {
        this.principalId = principalId;
        this.principalType = principalType;
        this.role = role;
    }

    public Long getPrincipalId() {
        return principalId;
    }

    public void setPrincipalId(Long principalId) {
        this.principalId = principalId;
    }

    public String getPrincipalType() {
        return principalType;
    }

    public void setPrincipalType(String principalType) {
        this.principalType = principalType;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    @Override
    public String toString() {
        return "{principalId=" + principalId +
                ", principalType='" + principalType + '\'' +
                ", role='" + role + '\'' +
                '}';
    }
}
