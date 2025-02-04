package ru.mycrg.acceptance.gis_service.dto;

public class LayerGroupUpdateDto {

    private final String title;

    private final Long parentId;

    private int position;

    private final String enabled;

    private final String expanded;

    private int transparency;

    public LayerGroupUpdateDto(String title, Long parentId, int position, String enabled, String expanded,
                               int transparency) {
        this.title = title;
        this.parentId = parentId;
        this.position = position;
        this.enabled = enabled;
        this.expanded = expanded;
        this.transparency = transparency;
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

    public String getEnabled() {
        return enabled;
    }

    public String getExpanded() {
        return expanded;
    }

    public int getTransparency() {
        return transparency;
    }
}
