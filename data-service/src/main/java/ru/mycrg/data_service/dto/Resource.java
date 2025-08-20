package ru.mycrg.data_service.dto;

import java.util.List;

public class Resource {

    private String identifier;
    private String createdAt;
    private String type;
    private List<PermissionProjection> permissions;

    public Resource() {
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<PermissionProjection> getPermissions() {
        return permissions;
    }

    public void setPermissions(List<PermissionProjection> permissions) {
        this.permissions = permissions;
    }
}
