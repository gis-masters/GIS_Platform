package ru.mycrg.integration_service.bpmn.publication.dxf.gis_layer;

import java.io.Serializable;

public class DxfLayer implements Serializable {

    private Long projectId;
    private String type;
    private String tableName;
    private String title;
    private String mode;
    private String nativeCRS;
    private String libraryId;
    private Long recordId;
    private boolean enabled;
    private String schemaId;
    private String styleName;
    private String dataStoreName;

    public DxfLayer(Long projectId, String tableName, String title, String nativeCRS, String libraryId, Long recordId,
                    String schemaId, String styleName, String dataStoreName) {
        this.type = "dxf";
        this.mode = "gis-service";
        this.enabled = true;

        this.projectId = projectId;

        this.tableName = tableName;
        this.title = title;
        this.nativeCRS = nativeCRS;
        this.libraryId = libraryId;
        this.recordId = recordId;

        this.schemaId = schemaId;
        this.styleName = styleName;
        this.dataStoreName = dataStoreName;
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

    public String getSchemaId() {
        return schemaId;
    }

    public void setSchemaId(String schemaId) {
        this.schemaId = schemaId;
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

    @Override
    public String toString() {
        return "{" +
                "\"projectId\":" + (projectId == null ? "null" : "\"" + projectId + "\"") + ", " +
                "\"type\":" + (type == null ? "null" : "\"" + type + "\"") + ", " +
                "\"tableName\":" + (tableName == null ? "null" : "\"" + tableName + "\"") + ", " +
                "\"title\":" + (title == null ? "null" : "\"" + title + "\"") + ", " +
                "\"mode\":" + (mode == null ? "null" : "\"" + mode + "\"") + ", " +
                "\"nativeCRS\":" + (nativeCRS == null ? "null" : "\"" + nativeCRS + "\"") + ", " +
                "\"libraryId\":" + (libraryId == null ? "null" : "\"" + libraryId + "\"") + ", " +
                "\"recordId\":" + (recordId == null ? "null" : "\"" + recordId + "\"") + ", " +
                "\"enabled\":\"" + enabled + "\"" + ", " +
                "\"schemaId\":" + (schemaId == null ? "null" : "\"" + schemaId + "\"") + ", " +
                "\"styleName\":" + (styleName == null ? "null" : "\"" + styleName + "\"") + ", " +
                "\"dataStoreName\":" + (dataStoreName == null ? "null" : "\"" + dataStoreName + "\"") +
                "}";
    }
}
