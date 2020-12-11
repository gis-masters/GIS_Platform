package ru.mycrg.acceptance.gis_service.dto;

public class LayerUpdateDto {

    private String title;
    private String dataset;
    private Boolean enabled;
    private int minZoom;
    private int maxZoom;
    private String nativeCRS;
    private int position = 1;
    private int transparency = 1;
    private Long groupId;

    public LayerUpdateDto(String title, String dataset, Boolean enabled, int position, int transparency, int minZoom,
                          int maxZoom, String nativeCRS) {
        this.title = title;
        this.dataset = dataset;
        this.enabled = enabled;
        this.position = position;
        this.transparency = transparency;
        this.minZoom = minZoom;
        this.maxZoom = maxZoom;
        this.nativeCRS = nativeCRS;
    }

    public LayerUpdateDto(String title, String dataset, Boolean enabled, int minZoom, int maxZoom,
                          String nativeCRS, Long groupId) {
        this.title = title;
        this.dataset = dataset;
        this.enabled = enabled;
        this.minZoom = minZoom;
        this.maxZoom = maxZoom;
        this.nativeCRS = nativeCRS;
        this.groupId = groupId;
    }

    public LayerUpdateDto(Long groupId) {
        this.groupId = groupId;
    }

    public String getTitle() {
        return title;
    }

    public String getDataset() {
        return dataset;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public int getPosition() {
        return position;
    }

    public int getTransparency() {
        return transparency;
    }

    public int getMinZoom() {
        return minZoom;
    }

    public int getMaxZoom() {
        return maxZoom;
    }

    public Long getGroupId() {
        return groupId;
    }

    public String getNativeCRS() {
        return nativeCRS;
    }
}
