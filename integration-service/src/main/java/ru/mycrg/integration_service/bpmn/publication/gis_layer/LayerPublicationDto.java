package ru.mycrg.integration_service.bpmn.publication.gis_layer;

import java.io.Serializable;

public class LayerPublicationDto implements Serializable {

    private String type;
    private String mode;
    private Long projectId;
    private String title;
    private String tableName;
    private String nativeName;
    private String nativeCRS;
    private String libraryId;
    private Long recordId;
    private boolean enabled;
    private String styleName;
    private String dataStoreName;
    private String dataset;
    private String dataSourceUri;

    public LayerPublicationDto(String dataset, String tableName, String title, String libraryId, Long recordId,
                               String nativeCRS, Long projectId, String dataSourceUri, String mode) {
        this.title = title;
        this.tableName = tableName;
        this.libraryId = libraryId;
        this.recordId = recordId;
        this.dataSourceUri = dataSourceUri;
        this.dataset = dataset;
        this.nativeCRS = nativeCRS;
        this.projectId = projectId;
        this.mode = mode;

        this.type = "raster";
        this.enabled = true;
    }

    public LayerPublicationDto(String type, String mode, Long projectId, String tableName, String nativeName,
                               String title, String nativeCRS, String libraryId, Long recordId, String styleName,
                               String workspaceName, String dataset) {
        this.type = type;
        this.mode = mode;
        this.enabled = true;

        this.projectId = projectId;

        this.tableName = tableName;
        this.nativeName = nativeName;
        this.title = title;
        this.nativeCRS = nativeCRS;
        this.libraryId = libraryId;
        this.recordId = recordId;

        this.styleName = styleName;
        this.dataStoreName = workspaceName;
        this.dataset = dataset;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public String getNativeCRS() {
        return nativeCRS;
    }

    public void setNativeCRS(String nativeCRS) {
        this.nativeCRS = nativeCRS;
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

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public String getStyleName() {
        return styleName;
    }

    public void setStyleName(String styleName) {
        this.styleName = styleName;
    }

    public String getDataStoreName() {
        return dataStoreName;
    }

    public void setDataStoreName(String dataStoreName) {
        this.dataStoreName = dataStoreName;
    }

    public String getDataset() {
        return dataset;
    }

    public void setDataset(String dataset) {
        this.dataset = dataset;
    }

    public String getNativeName() {
        return nativeName;
    }

    public void setNativeName(String nativeName) {
        this.nativeName = nativeName;
    }

    public String getDataSourceUri() {
        return dataSourceUri;
    }

    public void setDataSourceUri(String dataSourceUri) {
        this.dataSourceUri = dataSourceUri;
    }

    @Override
    public String toString() {
        return "{" +
                "\"type\":" + (type == null ? "null" : "\"" + type + "\"") + ", " +
                "\"mode\":" + (mode == null ? "null" : "\"" + mode + "\"") + ", " +
                "\"projectId\":" + (projectId == null ? "null" : "\"" + projectId + "\"") + ", " +
                "\"title\":" + (title == null ? "null" : "\"" + title + "\"") + ", " +
                "\"tableName\":" + (tableName == null ? "null" : "\"" + tableName + "\"") + ", " +
                "\"nativeName\":" + (nativeName == null ? "null" : "\"" + nativeName + "\"") + ", " +
                "\"nativeCRS\":" + (nativeCRS == null ? "null" : "\"" + nativeCRS + "\"") + ", " +
                "\"libraryId\":" + (libraryId == null ? "null" : "\"" + libraryId + "\"") + ", " +
                "\"recordId\":" + (recordId == null ? "null" : recordId) + ", " +
                "\"enabled\":\"" + enabled + "\"" + ", " +
                "\"styleName\":" + (styleName == null ? "null" : "\"" + styleName + "\"") + ", " +
                "\"dataStoreName\":" + (dataStoreName == null ? "null" : "\"" + dataStoreName + "\"") + ", " +
                "\"dataset\":" + (dataset == null ? "null" : "\"" + dataset + "\"") + ", " +
                "\"dataSourceUri\":" + (dataSourceUri == null ? "null" : "\"" + dataSourceUri + "\"") +
                "}";
    }
}
