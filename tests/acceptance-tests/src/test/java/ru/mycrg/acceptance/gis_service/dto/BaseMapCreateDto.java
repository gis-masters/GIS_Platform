package ru.mycrg.acceptance.gis_service.dto;

public class BaseMapCreateDto {

    private final long baseMapId;

    private final String title;

    private int position = -1;

    public BaseMapCreateDto(long baseMapId, String title, int position) {
        this.baseMapId = baseMapId;
        this.title = title;
        this.position = position;
    }

    public BaseMapCreateDto(long baseMapId, String title) {
        this.baseMapId = baseMapId;
        this.title = title;
    }

    public long getBaseMapId() {
        return baseMapId;
    }

    public String getTitle() {
        return title;
    }

    public int getPosition() {
        return position;
    }
}
