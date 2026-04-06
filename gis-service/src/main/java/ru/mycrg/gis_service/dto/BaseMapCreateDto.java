package ru.mycrg.gis_service.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class BaseMapCreateDto {

    @Min(1)
    @Max(Long.MAX_VALUE)
    private long baseMapId;

    @NotBlank
    @Size(min = 3, max = 255)
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
