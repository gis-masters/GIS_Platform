package ru.mycrg.gis_service_contract.dto;

import ru.mycrg.common_contracts.enums.Roles;

import java.time.LocalDateTime;

public class ProjectBaseProjection {

    private Long id;
    private String name;
    private String description;
    private long organizationId;
    private String bbox;
    private boolean isDefault;
    private String path;
    private boolean isFolder;
    private LocalDateTime createdAt;

    private Roles role;

    public ProjectBaseProjection() {
        //req
    }

    public ProjectBaseProjection(Long id, String name, String description, long organizationId, String bbox,
                                 boolean isDefault, String path, boolean isFolder, LocalDateTime createdAt,
                                 Roles role) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.organizationId = organizationId;
        this.bbox = bbox;
        this.isDefault = isDefault;
        this.path = path;
        this.isFolder = isFolder;
        this.createdAt = createdAt;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(long organizationId) {
        this.organizationId = organizationId;
    }

    public String getBbox() {
        return bbox;
    }

    public void setBbox(String bbox) {
        this.bbox = bbox;
    }

    public boolean isDefault() {
        return isDefault;
    }

    public void setDefault(boolean aDefault) {
        isDefault = aDefault;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public boolean isFolder() {
        return isFolder;
    }

    public void setFolder(boolean folder) {
        isFolder = folder;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Roles getRole() {
        return role;
    }

    public void setRole(Roles role) {
        this.role = role;
    }

    @Override
    public String toString() {
        return "{" +
                "\"id\":\"" + id + "\"" + ", " +
                "\"name\":" + (name == null ? "null" : "\"" + name + "\"") + ", " +
                "\"description\":" + (description == null ? "null" : "\"" + description + "\"") + ", " +
                "\"organizationId\":\"" + organizationId + "\"" + ", " +
                "\"bbox\":" + (bbox == null ? "null" : "\"" + bbox + "\"") + ", " +
                "\"isDefault\":\"" + isDefault + "\"" + ", " +
                "\"path\":" + (path == null ? "null" : "\"" + path + "\"") + ", " +
                "\"isFolder\":\"" + isFolder + "\"" + ", " +
                "\"createdAt\":" + (createdAt == null ? "null" : createdAt) + ", " +
                "\"role\":" + (role == null ? "null" : "\"" + role + "\"") +
                "}";
    }
}
