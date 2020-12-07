package ru.mycrg.acceptance.gis_service.dto;

public class LayerGroupUpdateDto {

    private final String title;

    private final Long parent;

    private int position = -1;

    private final String enabled;

    private final String expanded;

    private int transparency = -1;

    public LayerGroupUpdateDto(String title, Long parent, int position, String enabled, String expanded,
                               int transparency) {
        this.title = title;
        this.parent = parent;
        this.position = position;
        this.enabled = enabled;
        this.expanded = expanded;
        this.transparency = transparency;
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
