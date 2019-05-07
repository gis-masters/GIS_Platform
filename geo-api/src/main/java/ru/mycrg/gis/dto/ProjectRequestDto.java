package ru.mycrg.gis.dto;

public class ProjectRequestDto extends BaseRequest {

    private String projectName;

    public ProjectRequestDto() {}

    public ProjectRequestDto(String projectName) {
        this.projectName = projectName;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }
}
