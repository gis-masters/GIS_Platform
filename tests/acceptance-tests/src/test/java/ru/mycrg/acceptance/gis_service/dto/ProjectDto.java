package ru.mycrg.acceptance.gis_service.dto;

public class ProjectDto {

    private String name;
    private String description;
    private String bbox;
    private Boolean isDefault;

    public ProjectDto(String name) {
        this(name, null, null, false);
    }

    public ProjectDto(String name, String description, String bbox) {
        this(name, description, bbox, false);
    }

   public ProjectDto(String name, String description, String bbox, boolean isDefault) {
        this.name = name;
        this.description = description;
        this.bbox = bbox;
        this.isDefault = isDefault;
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

    public String getBbox() {
        return bbox;
    }

    public void setBbox(String bbox) {
        this.bbox = bbox;
    }

    public Boolean getDefault() {
        return isDefault;
    }

    public void setDefault(Boolean aDefault) {
        isDefault = aDefault;
    }

    @Override
    public String toString() {
        return "{" +
                "\"name\":" + (name == null ? "null" : "\"" + name + "\"") + ", " +
                "\"description\":" + (description == null ? "null" : "\"" + description + "\"") + ", " +
                "\"bbox\":" + (bbox == null ? "null" : "\"" + bbox + "\"") + ", " +
                "\"default\":" + (isDefault == null ? "null" : "\"" + isDefault + "\"") +
                "}";
    }
}
