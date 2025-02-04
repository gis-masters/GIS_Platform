package ru.mycrg.gis_service.dto.project;

import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

public class ProjectUpdateDto extends ProjectDto {

    @Size(min = 3, max = 250, message = "Не менее 3 и не более 250 символов")
    @Pattern(regexp = "^([a-zA-Zа-яА-ЯёЁ]{1}[a-zA-Zа-яА-ЯёЁ0-9._ -]+)$",
             message = "Должно начинаться с буквы. Затем может содержать: буквы, цифры и символы .-_")
    private String name;

    public ProjectUpdateDto() {
        // Required
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "{" +
                "\"name\":" + (name == null ? "null" : "\"" + name + "\"") + ", " +
                "\"description\":" + (description == null ? "null" : "\"" + description + "\"") + ", " +
                "\"bbox\":" + (bbox == null ? "null" : "\"" + bbox + "\"") + ", " +
                "\"isDefault\":\"" + isDefault + "\"" +
                "}";
    }
}
