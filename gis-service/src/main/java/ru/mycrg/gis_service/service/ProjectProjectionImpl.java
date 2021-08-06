package ru.mycrg.gis_service.service;

import org.springframework.hateoas.core.Relation;
import ru.mycrg.gis_service.dto.ProjectProjection;
import ru.mycrg.gis_service.entity.Project;

import java.time.LocalDateTime;

@Relation(collectionRelation = "projects")
public class ProjectProjectionImpl implements ProjectProjection {

    private final long id;
    private final String name;
    private final String internalName;
    private final long organizationId;
    private final String bbox;
    private final boolean isDefault;
    private final LocalDateTime createdAt;
    private String role;

    public ProjectProjectionImpl(Project project) {
        this.id = project.getId();
        this.name = project.getName();
        this.internalName = project.getInternalName();
        this.organizationId = project.getOrganizationId();
        this.bbox = project.getBbox();
        this.isDefault = project.isDefault();
        this.createdAt = project.getCreatedAt();
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
    public String getInternalName() {
        return this.internalName;
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
    public LocalDateTime getCreatedAt() {
        return this.createdAt;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getRole() {
        return role;
    }
}
