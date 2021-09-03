package ru.mycrg.gis_service.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

public class ProjectRequestDto {

    @NotBlank(message = "Забыли указать название проекта")
    @Size(min = 3, max = 250, message = "Не менее 3 и не более 250 символов")
    @Pattern(regexp = "^([a-zA-Zа-яА-ЯёЁ]{1}[a-zA-Zа-яА-ЯёЁ0-9._ -]+)$",
             message = "Должно начинаться с буквы. Затем может содержать: буквы, цифры и символы .-_")
    private String projectName;

    public ProjectRequestDto() {
        //Required by framework
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }
}
