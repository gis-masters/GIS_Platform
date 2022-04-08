package ru.mycrg.gis_service.dto;

import org.hibernate.validator.constraints.Length;
import ru.mycrg.gis_service.validators.CrgParentGroup;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.Pattern;

public class GroupUpdateDto {

    @Length(min = 1, max = 255)
    private String title;

    @CrgParentGroup
    private Long parentId;

    @Max(Integer.MAX_VALUE)
    private int position = -1;

    @Pattern(regexp = "^(true|false)$", message = "Допустимые значения поля enabled: true или false")
    private String enabled;

    @Pattern(regexp = "^(true|false)$", message = "Допустимые значения поля expanded: true или false")
    private String expanded;

    @Min(message = "Минимальное значение прозрачности 5", value = 5)
    @Max(message = "Максимальное значение прозрачности 100", value = 100)
    private int transparency = 100;

    public GroupUpdateDto() {
        //Required by framework
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public int getPosition() {
        return position;
    }

    public void setPosition(int position) {
        this.position = position;
    }

    public String getEnabled() {
        return enabled;
    }

    public void setEnabled(String enabled) {
        this.enabled = enabled;
    }

    public String getExpanded() {
        return expanded;
    }

    public void setExpanded(String expanded) {
        this.expanded = expanded;
    }

    public int getTransparency() {
        return transparency;
    }

    public void setTransparency(int transparency) {
        this.transparency = transparency;
    }
}
