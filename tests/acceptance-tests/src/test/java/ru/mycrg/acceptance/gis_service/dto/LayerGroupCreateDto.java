package ru.mycrg.acceptance.gis_service.dto;

public class LayerGroupCreateDto {

    private final String title;
    private final int position;
    private Long parentId;

    public LayerGroupCreateDto() {
        this("Default layer group title", 314);
    }

    public LayerGroupCreateDto(String title, int position, Long parentId) {
        this(title, position);

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
