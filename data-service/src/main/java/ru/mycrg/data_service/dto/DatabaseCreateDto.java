package ru.mycrg.data_service.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

public class DatabaseCreateDto {

    @NotBlank
    @Size(min = 3, max = 50)
    @Pattern(regexp = "^[^\\d][a-zA-z0-9_$]*$", message = "Некорректное имя БД")
    private String name;

    public DatabaseCreateDto() {
        // Required
    }

    public DatabaseCreateDto(String name) {
        this.name = name;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

}
