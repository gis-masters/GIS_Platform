package ru.mycrg.data_service.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

public class ResourceCreateDto {

    @NotBlank
    @Size(min = 3, max = 60)
    @Pattern(regexp = "^[a-z].[a-z0-9_]*$", message = "Название некорректно. Может содержать только: буквы " +
            "латинского алфавита в нижнем регистре, цифры и символ '_'. Должно начинаться с букв.")
    private String name;

    @NotBlank
    @Size(max = 250)
    private String title;

    @Size(max = 1000)
    private String details;

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }
}
