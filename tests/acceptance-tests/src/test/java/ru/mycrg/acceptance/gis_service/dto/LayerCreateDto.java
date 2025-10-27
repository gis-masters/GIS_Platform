package ru.mycrg.acceptance.gis_service.dto;

public class LayerCreateDto {

    private final String title;
    private final String type;

    private String dataset;
    private String resourceId;
    private String styleName;
    private String schemaId;
    private String dataStoreName;
    private String nativeCRS;
    private String dataSourceUri;
    private String sourceId;
    private String sourceType;
    private Long sourceRecordId;
    private long minZoom;
    private long maxZoom;
    private String mode;
    private String contentType;
    private String style;

    public LayerCreateDto(String title, String type) {
        this.title = title;
        this.type = type;
    }

    public LayerCreateDto(String title, String dataset, String resourceId, String styleName, String type,
                          String dataStoreName, String nativeCRS, String dataSourceUri, String contentType,
                          String style) {
        this.title = title;
        this.dataset = dataset;
        this.resourceId = resourceId;
        this.styleName = styleName;
        this.type = type;
        this.dataStoreName = dataStoreName;
        this.nativeCRS = nativeCRS;
        this.dataSourceUri = dataSourceUri;
        this.contentType = contentType;
        this.style = style;
        this.sourceType = "document";
    }

    public String getTitle() {
        return title;
    }

    public String getDataset() {
        return dataset;
    }

    public String getResourceId() {
        return resourceId;
    }

    public String getStyleName() {
        return styleName;
    }

    public String getType() {
        return type;
    }

    public String getSchemaId() {
        return schemaId;
    }

    public String getDataStoreName() {
        return dataStoreName;
    }

    public String getNativeCRS() {
        return nativeCRS;
    }

    public String getDataSourceUri() {
        return dataSourceUri;
    }

    public void setDataset(String dataset) {
        this.dataset = dataset;
    }

    public void setResourceId(String resourceId) {
        this.resourceId = resourceId;
    }

    public void setStyleName(String styleName) {
        this.styleName = styleName;
    }

    public void setSchemaId(String schemaId) {
        this.schemaId = schemaId;
    }

    public void setDataStoreName(String dataStoreName) {
        this.dataStoreName = dataStoreName;
    }

    public void setNativeCRS(String nativeCRS) {
        this.nativeCRS = nativeCRS;
    }

    public void setDataSourceUri(String dataSourceUri) {
        this.dataSourceUri = dataSourceUri;
    }

    public long getMinZoom() {
        return minZoom;
    }

    public void setMinZoom(long minZoom) {
        this.minZoom = minZoom;
    }

    public long getMaxZoom() {
        return maxZoom;
    }

    public void setMaxZoom(long maxZoom) {
        this.maxZoom = maxZoom;
    }

    public String getSourceId() {
        return sourceId;
    }

    public void setSourceId(String sourceId) {
        this.sourceId = sourceId;
    }

    public Long getSourceRecordId() {
        return sourceRecordId;
    }

    public void setSourceRecordId(Long sourceRecordId) {
        this.sourceRecordId = sourceRecordId;
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public String getStyle() {
        return style;
    }

    public void setStyle(String style) {
        this.style = style;
    }

    public String getSourceType() {
        return sourceType;
    }

    public void setSourceType(String sourceType) {
        this.sourceType = sourceType;
    }
}
