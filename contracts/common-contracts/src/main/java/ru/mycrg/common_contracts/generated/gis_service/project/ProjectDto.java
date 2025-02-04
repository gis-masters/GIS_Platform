package ru.mycrg.common_contracts.generated.gis_service.project;

public class ProjectDto extends ProjectCreateDto {

    private String id;
    private String organizationId;
    private String createdAt;
    private String role;

    public ProjectDto() {
        // Required
    }

    public ProjectDto(String name, String description, String bbox, boolean isDefault, String id, String organizationId,
                      String createdAt, String role) {
        super(name, description, bbox, isDefault);

        this.id = id;
        this.organizationId = organizationId;
        this.createdAt = createdAt;
        this.role = role;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(String organizationId) {
        this.organizationId = organizationId;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
