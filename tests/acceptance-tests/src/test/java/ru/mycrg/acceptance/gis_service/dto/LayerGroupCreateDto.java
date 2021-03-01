package ru.mycrg.acceptance.gis_service.dto;

public class LayerGroupCreateDto {

    private final String title;
    private Long parentId;
    private int position;

    public LayerGroupCreateDto(String title, int position, Long parentId) {
        this.title = title;
        this.position = position;
        this.parentId = parentId;
    }

    public LayerGroupCreateDto(String title, int position) {
        this.title = title;
        this.position = position;
    }

    public String getTitle() {
        return title;
    }

    public Long getParentId() {
        return parentId;
    }

    public int getPosition() {
        return position;
    }
}
