package ru.mycrg.acceptance.gis_service.dto;

public class LayerGroupCreateDto {

    private final String title;

    private Long parent;
    private int position;

    public LayerGroupCreateDto(String title, int position, Long parent) {
        this.title = title;
        this.position = position;
        this.parent = parent;
    }

    public LayerGroupCreateDto(String title, int position) {
        this.title = title;
        this.position = position;
    }

    public String getTitle() {
        return title;
    }

    public Long getParent() {
        return parent;
    }

    public int getPosition() {
        return position;
    }
}
