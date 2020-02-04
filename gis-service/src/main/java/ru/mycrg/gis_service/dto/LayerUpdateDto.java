package ru.mycrg.gis_service.dto;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

public class LayerUpdateDto {

    @Size(max = 255)
    private String title;

    @Pattern(regexp = "^(true|false)$", message = "Field allowed input: true or false")
    private String enabled;

    private int position = -1;

    @Min(message = "Минимальное значение прозрачности 0", value = -1)
    @Max(message = "Максимальное значение прозрачности 100", value = 100)
    private int transparency = -1;

    @Size(max = 100)
    private String styleName;

    public LayerUpdateDto() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getStyleName() {
        return styleName;
    }

    public void setStyleName(String styleName) {
        this.styleName = styleName;
    }

    public String getEnabled() {
        return enabled;
    }

    public void setEnabled(String enabled) {
        this.enabled = enabled;
    }

    public int getPosition() {
        return position;
    }

    public void setPosition(int position) {
        this.position = position;
    }

    public int getTransparency() {
        return transparency;
    }

    public void setTransparency(int transparency) {
        this.transparency = transparency;
    }

    @Override
    public String toString() {
        return "LayerUpdateDto{" +
                "title='" + title + '\'' +
                ", enabled=" + enabled +
                ", position=" + position +
                ", transparency=" + transparency +
                ", styleName='" + styleName + '\'' +
                '}';
    }
}
