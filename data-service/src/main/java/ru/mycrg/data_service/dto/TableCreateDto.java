package ru.mycrg.data_service.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

public class TableCreateDto extends ResourceCreateDto {

    @NotBlank
    @Size(min = 3, max = 60)
    @Pattern(regexp = "^[a-z].[a-z0-9_]*$", message = "Название некорректно. Может содержать только: буквы " +
            "латинского алфавита в нижнем регистре, цифры и символ '_'. Должно начинаться с букв.")
    private String name;

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
