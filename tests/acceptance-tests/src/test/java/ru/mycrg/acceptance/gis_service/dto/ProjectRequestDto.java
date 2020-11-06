package ru.mycrg.acceptance.gis_service.dto;

public class ProjectRequestDto {

    private final String projectName;

    public ProjectRequestDto(String projectName) {
        this.projectName = projectName;
    }

    public String getProjectName() {
        return projectName;
    }
}
