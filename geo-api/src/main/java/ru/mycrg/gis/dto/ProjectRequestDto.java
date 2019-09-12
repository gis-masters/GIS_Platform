package ru.mycrg.gis.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

public class ProjectRequestDto extends BaseRequest {

    @NotBlank(message = "Забыли указать название проекта")
    @Size(min=3, max=50, message = "Не менее 3 и не более 50 символов")
    @Pattern(regexp = "^([a-zA-Zа-яА-ЯёЁ]{1}[a-zA-Zа-яА-ЯёЁ0-9._ -]+)$",
            message = "Должно начинаться с буквы. Затем может содержать: буквы, цифры и символы .-_")
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
