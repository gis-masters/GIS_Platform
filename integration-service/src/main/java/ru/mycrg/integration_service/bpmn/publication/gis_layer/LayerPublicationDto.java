package ru.mycrg.integration_service.bpmn.publication.gis_layer;

import java.io.Serializable;

//TODO: у нас 4 dto для слоёв. УДАЛИТЬ ВСЕ КРОМЕ ОДНОЙ! (LayerProjection, LayerCreateDto,
// SpecializationLayerPublicationModel) (Azure №3970)
public class LayerPublicationDto implements Serializable {

    private String type;
    private String mode;
    private Long projectId;
    private Long parentId;
    private String title;
    private String resourceId;
    private String nativeName;
    private String nativeCRS;
    private String sourceId;
    private String sourceType;
    private Long sourceRecordId;
    private boolean enabled;
    private String styleName;
    private String dataStoreName;
    private String dataset;
    private String dataSourceUri;

    public LayerPublicationDto(String dataset, String resourceId, String title, String sourceId, String sourceType,
                               Long sourceRecordId, String nativeCRS, Long projectId, String dataSourceUri,
                               String mode) {
        this.title = title;
        this.resourceId = resourceId;
        this.sourceId = sourceId;
        this.sourceType = sourceType;
        this.sourceRecordId = sourceRecordId;
        this.dataSourceUri = dataSourceUri;
        this.dataset = dataset;
        this.nativeCRS = nativeCRS;
        this.projectId = projectId;
        this.mode = mode;

        this.type = "raster";
        this.enabled = true;
    }

    public LayerPublicationDto(String type, String mode, Long projectId, String resourceId, String nativeName,
                               String title, String nativeCRS, String sourceId, String sourceType, Long sourceRecordId,
                               String styleName, String workspaceName, String dataset) {
        this.type = type;
        this.mode = mode;
        this.enabled = true;

        this.projectId = projectId;

        this.resourceId = resourceId;
        this.nativeName = nativeName;
        this.title = title;
        this.nativeCRS = nativeCRS;
        this.sourceId = sourceId;
        this.sourceType = sourceType;
        this.sourceRecordId = sourceRecordId;

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

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
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

    public String getSourceType() {
        return sourceType;
    }

    public void setSourceType(String sourceType) {
        this.sourceType = sourceType;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getResourceId() {
        return resourceId;
    }

    public void setResourceId(String resourceId) {
        this.resourceId = resourceId;
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
                "\"parentId\":" + (parentId == null ? "null" : "\"" + parentId + "\"") + ", " +
                "\"title\":" + (title == null ? "null" : "\"" + title + "\"") + ", " +
                "\"resourceId\":" + (resourceId == null ? "null" : "\"" + resourceId + "\"") + ", " +
                "\"nativeName\":" + (nativeName == null ? "null" : "\"" + nativeName + "\"") + ", " +
                "\"nativeCRS\":" + (nativeCRS == null ? "null" : "\"" + nativeCRS + "\"") + ", " +
                "\"sourceId\":" + (sourceId == null ? "null" : "\"" + sourceId + "\"") + ", " +
                "\"sourceType\":" + (sourceType == null ? "null" : "\"" + sourceType + "\"") + ", " +
                "\"sourceRecordId\":" + (sourceRecordId == null ? "null" : "\"" + sourceRecordId + "\"") + ", " +
                "\"enabled\":\"" + enabled + "\"" + ", " +
                "\"styleName\":" + (styleName == null ? "null" : "\"" + styleName + "\"") + ", " +
                "\"dataStoreName\":" + (dataStoreName == null ? "null" : "\"" + dataStoreName + "\"") + ", " +
                "\"dataset\":" + (dataset == null ? "null" : "\"" + dataset + "\"") + ", " +
                "\"dataSourceUri\":" + (dataSourceUri == null ? "null" : "\"" + dataSourceUri + "\"") +
                "}";
    }
}
