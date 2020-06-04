package ru.mycrg.data_service.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

public class DatabaseCreateDto {

    @Pattern(regexp = "^[^\\d][a-zA-z0-9_$]*$", message = "Неверное имя БД")
    @NotBlank
    private String name;

    public DatabaseCreateDto() {
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

}