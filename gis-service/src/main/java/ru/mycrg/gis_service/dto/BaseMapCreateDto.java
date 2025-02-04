package ru.mycrg.gis_service.dto;

import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;

public class BaseMapCreateDto {

    @Min(1)
    @Max(Long.MAX_VALUE)
    private long baseMapId;

    @NotBlank
    @Length(min = 3, max = 255)
    private String title;

    @Max(Integer.MAX_VALUE)
    private int position = -1;

    public BaseMapCreateDto() {
        //Required by framework
    }

    public long getBaseMapId() {
        return baseMapId;
    }

    public void setBaseMapId(long baseMapId) {
        this.baseMapId = baseMapId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getPosition() {
        return position;
    }

    public void setPosition(int position) {
        this.position = position;
    }
}
