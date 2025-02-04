package ru.mycrg.common_contracts.generated.gis_service.project;

public class ProjectCreateDto {

    private String name;
    private String bbox;
    private String description;
    private boolean isDefault;

    public ProjectCreateDto() {
        // Required
    }

    public ProjectCreateDto(String name) {
        this(name, null, null, false);
    }

    public ProjectCreateDto(String name, String description, String bbox) {
        this(name, description, bbox, false);
    }

    public ProjectCreateDto(String name, String description, String bbox, boolean isDefault) {
        this.name = name;
        this.bbox = bbox;
        this.description = description;
        this.isDefault = isDefault;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBbox() {
        return bbox;
    }

    public void setBbox(String bbox) {
        this.bbox = bbox;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isDefault() {
        return isDefault;
    }

    public void setDefault(boolean aDefault) {
        this.isDefault = aDefault;
    }
}
