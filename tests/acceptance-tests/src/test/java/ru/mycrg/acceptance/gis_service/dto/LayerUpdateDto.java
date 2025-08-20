package ru.mycrg.acceptance.gis_service.dto;

public class LayerUpdateDto {

    private String title;
    private String dataset;
    private Boolean enabled;
    private int minZoom;
    private int maxZoom;
    private String nativeCRS;
    private int position = 1;
    private int transparency = 10;
    private Long parentId;
    private String contentType;
    private String style;

    public LayerUpdateDto() {
        // Required
    }

    public LayerUpdateDto(Long parentId) {
        this.parentId = parentId;
    }

    public LayerUpdateDto(String title, String dataset, Boolean enabled, int position, int transparency, int minZoom,
                          int maxZoom, String nativeCRS, String contentType, String style) {
        this.title = title;
        this.dataset = dataset;
        this.enabled = enabled;
        this.position = position;
        this.transparency = transparency;
        this.minZoom = minZoom;
        this.maxZoom = maxZoom;
        this.nativeCRS = nativeCRS;
        this.contentType = contentType;
        this.style = style;
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

    public Long getParentId() {
        return parentId;
    }

    public String getNativeCRS() {
        return nativeCRS;
    }

    public String getContentType() {
        return contentType;
    }

    public String getStyle() {
        return style;
    }
}
