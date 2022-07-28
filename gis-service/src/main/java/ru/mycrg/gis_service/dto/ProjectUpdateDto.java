package ru.mycrg.gis_service.dto;

import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

public class ProjectUpdateDto {

    @Size(min = 3, max = 250, message = "Не менее 3 и не более 250 символов")
    @Pattern(regexp = "^([a-zA-Zа-яА-ЯёЁ]{1}[a-zA-Zа-яА-ЯёЁ0-9._ -]+)$",
             message = "Должно начинаться с буквы. Затем может содержать: буквы, цифры и символы .-_")
    private String name;
    private String description;
    // field bbox should be like "[3788517.6,5579665.7,3848968.7,5614937.0]"
    @Pattern(regexp = "^\\[\\d*[.]\\d+,\\d*[.]\\d+,\\d*[.]\\d+,\\d*[.]\\d+]$",
             message = "Должно быть в квадратных скобках [], содержать 4-е дробных числа разделённых запятой, " +
                     "пробелов между числами быть не должно")
    private String bbox;

    public ProjectUpdateDto() {
        // Required
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getBbox() {
        return bbox;
    }

    public void setBbox(String bbox) {
        this.bbox = bbox;
    }
}
