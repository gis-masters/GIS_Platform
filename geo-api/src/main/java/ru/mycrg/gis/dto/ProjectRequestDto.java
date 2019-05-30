package ru.mycrg.gis.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class ProjectRequestDto extends BaseRequest {

    @NotBlank(message = "Забыли указать название проекта")
    @Size(min=3, max=50, message = "Не менее 3 и не более 50 символов")
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
