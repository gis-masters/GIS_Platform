package ru.mycrg.acceptance.data_service.dto;

public class DatasetPermissionCreateDto {

    private final String principalType;
    private final long principalId;
    private final String role;

    public DatasetPermissionCreateDto(String principalType, long principalId, String role) {
        this.principalType = principalType;
        this.principalId = principalId;
        this.role = role;
    }

    public String getPrincipalType() {
        return principalType;
    }

    public long getPrincipalId() {
        return principalId;
    }

    public String getRole() {
        return role;
    }
}
