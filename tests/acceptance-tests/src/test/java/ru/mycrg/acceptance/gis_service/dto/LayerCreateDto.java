package ru.mycrg.acceptance.gis_service.dto;

public class LayerCreateDto {

    private final String title;
    private final String type;

    private String dataset;
    private String tableName;
    private String styleName;
    private String schemaId;
    private String dataStoreName;
    private String nativeCRS;
    private String dataSourceUri;
    private String libraryId;
    private Long recordId;
    private long minZoom;
    private long maxZoom;
    private String mode;
    private String contentType;
    private String style;

    public LayerCreateDto(String title, String type) {
        this.title = title;
        this.type = type;
    }

    public LayerCreateDto(String title, String dataset, String tableName, String styleName, String type,
                          String dataStoreName, String nativeCRS, String dataSourceUri, String contentType,
                          String style) {
        this.title = title;
        this.dataset = dataset;
        this.tableName = tableName;
        this.styleName = styleName;
        this.type = type;
        this.dataStoreName = dataStoreName;
        this.nativeCRS = nativeCRS;
        this.dataSourceUri = dataSourceUri;
        this.contentType = contentType;
        this.style = style;
    }

    public String getTitle() {
        return title;
    }

    public String getDataset() {
        return dataset;
    }

    public String getTableName() {
        return tableName;
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

    public void setTableName(String tableName) {
        this.tableName = tableName;
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

    public String getLibraryId() {
        return libraryId;
    }

    public void setLibraryId(String libraryId) {
        this.libraryId = libraryId;
    }

    public Long getRecordId() {
        return recordId;
    }

    public void setRecordId(Long recordId) {
        this.recordId = recordId;
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
}
