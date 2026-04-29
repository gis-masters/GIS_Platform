package ru.mycrg.common_contracts.generated.report_service;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class TemplateShortInfo implements TemplateShortProjection {

    @NotBlank(message = "Поле является обязательным!")
    @Pattern(
            regexp = "^[a-z0-9_-]+$",
            message = "Только латиница в нижнем регистре, цифры, символы _ и -"
    )
    private String name;

    @NotBlank(message = "Поле является обязательным!")
    private String title;

    public TemplateShortInfo() {
        //req
    }

    public TemplateShortInfo(String name, String title) {
        this.name = name;
        this.title = title;
    }

    @Override
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
