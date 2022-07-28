package ru.mycrg.acceptance.gis_service.dto;

public class ProjectUpdateDto {

    private String name;
    private String description;
    private String bbox;

    public ProjectUpdateDto() {
    }

    public ProjectUpdateDto(String name) {
        this.name = name;
    }

    public ProjectUpdateDto(String name, String description, String bbox) {
        this.name = name;
        this.description = description;
        this.bbox = bbox;
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
}
