package ru.mycrg.gis_service.dto.project;

import org.springframework.hateoas.core.Relation;
import ru.mycrg.gis_service.entity.Project;

import java.time.LocalDateTime;

@Relation(collectionRelation = "projects")
public class ProjectProjectionImpl implements ProjectProjection {

    private long id;
    private String name;
    private String description;
    private long organizationId;
    private String bbox;
    private boolean isDefault;
    private String path;
    private boolean isFolder;
    private LocalDateTime createdAt;

    private String role;

    public ProjectProjectionImpl() {
        // Required
    }

    public ProjectProjectionImpl(Project project) {
        this.id = project.getId();
        this.name = project.getName();
        this.organizationId = project.getOrganizationId();
        this.bbox = project.getBbox();
        this.isDefault = project.isDefault();
        this.isFolder = project.isFolder();
        this.createdAt = project.getCreatedAt();
        this.description = project.getDescription();
        this.path = project.getPath();
    }

    @Override
    public Long getId() {
        return this.id;
    }

    @Override
    public String getName() {
        return this.name;
    }

    @Override
    public long getOrganizationId() {
        return this.organizationId;
    }

    @Override
    public String getBbox() {
        return this.bbox;
    }

    @Override
    public boolean isDefault() {
        return this.isDefault;
    }

    @Override
    public boolean isFolder() {
        return this.isFolder;
    }

    @Override
    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getRole() {
        return role;
    }

    public void setId(long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setOrganizationId(long organizationId) {
        this.organizationId = organizationId;
    }

    public void setBbox(String bbox) {
        this.bbox = bbox;
    }

    public void setDefault(boolean aDefault) {
        isDefault = aDefault;
    }

    public void setFolder(boolean folder) {
        isFolder = folder;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }
}
