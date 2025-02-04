package ru.mycrg.acceptance.data_service.dto;

public class PermissionCreateDto {

    private final String principalType;
    private final long principalId;
    private final String role;

    public PermissionCreateDto(String principalType, long principalId, String role) {
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

    @Override
    public String toString() {
        return "{" +
                "principalType='" + principalType + '\'' +
                ", principalId=" + principalId +
                ", role='" + role + '\'' +
                '}';
    }
}
