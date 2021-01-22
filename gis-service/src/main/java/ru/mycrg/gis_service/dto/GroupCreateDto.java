package ru.mycrg.gis_service.dto;

import org.hibernate.validator.constraints.Length;
import ru.mycrg.gis_service.validators.CrgParentGroup;

import javax.validation.constraints.Max;
import javax.validation.constraints.NotBlank;

public class GroupCreateDto {

    @NotBlank
    @Length(min = 1, max = 255)
    private String title;

    @CrgParentGroup
    private Long parent;

    @Max(Integer.MAX_VALUE)
    private int position = -1;

    public GroupCreateDto() {
        //Required by framework
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Long getParent() {
        return parent;
    }

    public void setParent(Long parent) {
        this.parent = parent;
    }

    public int getPosition() {
        return position;
    }

    public void setPosition(int position) {
        this.position = position;
    }
}
