package ru.mycrg.notification.domain.template.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class TemplateRequestDto {

    @NotBlank(message = "Имя шаблона не может быть пустым")
    @Size(max = 50, message = "Имя шаблона не может быть длиннее 50 символов")
    private String name;

    @NotBlank(message = "Содержимое шаблона не может быть пустым")
    private String content;

    public TemplateRequestDto() {
        // Required
    }

    public TemplateRequestDto(String name, String content) {
        this.name = name;
        this.content = content;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    @Override
    public String toString() {
        return "TemplateRequestDto{" +
                "name='" + name + '\'' +
                ", content='" + content + '\'' +
                '}';
    }
}
