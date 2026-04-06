package ru.mycrg.gis_service_contract.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;
import java.time.LocalDateTime;

public class LayerProjection implements Serializable {

    private Long id;
    private String title;
    private String type;
    private String dataset;
    private String resourceId;
    private boolean enabled;
    private Integer position;
    private int transparency;
    private int maxZoom;
    private int minZoom;
    private String styleName;
    private String nativeCRS;
    private String dataSourceUri;
    private Long parentId;
    private Long projectId;
    private String complexName;
    private String sourceId;
    private String sourceType;
    private Long sourceRecordId;
    private String dataStoreName;
    private String contentType;
    private String view;
    private String errorText;
    private String style;
    private String photoMode;
    private LocalDateTime createdAt;
    private LocalDateTime lastModified;

    // Конструктор для JSON десериализации - только с полями, которые приходят в JSON
    @JsonCreator
    public LayerProjection(@JsonProperty("id") Long id,
                           @JsonProperty("title") String title,
                           @JsonProperty("type") String type,
                           @JsonProperty("dataset") String dataset,
                           @JsonProperty("resourceId") String resourceId,
                           @JsonProperty("enabled") boolean enabled,
                           @JsonProperty("position") Integer position,
                           @JsonProperty("transparency") int transparency,
                           @JsonProperty("maxZoom") int maxZoom,
                           @JsonProperty("minZoom") int minZoom,
                           @JsonProperty("styleName") String styleName,
                           @JsonProperty("nativeCRS") String nativeCRS,
                           @JsonProperty("parentId") Long parentId,
                           @JsonProperty("projectId") Long projectId,
                           @JsonProperty("complexName") String complexName,
                           @JsonProperty("dataStoreName") String dataStoreName,
                           @JsonProperty("view") String view,
                           @JsonProperty("createdAt") LocalDateTime createdAt,
                           @JsonProperty("lastModified") LocalDateTime lastModified) {
        this.id = id;
        this.title = title;
        this.type = type;
        this.dataset = dataset;
        this.resourceId = resourceId;
        this.enabled = enabled;
        this.position = position;
        this.transparency = transparency;
        this.maxZoom = maxZoom;
        this.minZoom = minZoom;
        this.styleName = styleName;
        this.nativeCRS = nativeCRS;
        this.dataSourceUri = null;
        this.parentId = parentId;
        this.projectId = projectId;
        this.complexName = complexName;
        this.sourceId = null;
        this.sourceType = null;
        this.sourceRecordId = null;
        this.dataStoreName = dataStoreName;
        this.contentType = null;
        this.view = view;
        this.errorText = null;
        this.style = null;
        this.photoMode = null;
        this.createdAt = createdAt;
        this.lastModified = lastModified;
    }

    public LayerProjection(Long id, String title, String type, String dataset, String resourceId, boolean enabled,
                           Integer position, int transparency, int maxZoom, int minZoom, String styleName,
                           String nativeCRS, String dataSourceUri, Long parentId, Long projectId, String complexName,
                           String sourceId, String sourceType, Long sourceRecordId, String dataStoreName,
                           String contentType, String view, String errorText, String style, String photoMode,
                           LocalDateTime createdAt, LocalDateTime lastModified) {
        this.id = id;
        this.title = title;
        this.type = type;
        this.dataset = dataset;
        this.resourceId = resourceId;
        this.enabled = enabled;
        this.position = position;
        this.transparency = transparency;
        this.maxZoom = maxZoom;
        this.minZoom = minZoom;
        this.styleName = styleName;
        this.nativeCRS = nativeCRS;
        this.dataSourceUri = dataSourceUri;
        this.parentId = parentId;
        this.projectId = projectId;
        this.complexName = complexName;
        this.sourceId = sourceId;
        this.sourceType = sourceType;
        this.sourceRecordId = sourceRecordId;
        this.dataStoreName = dataStoreName;
        this.contentType = contentType;
        this.view = view;
        this.errorText = errorText;
        this.style = style;
        this.photoMode = photoMode;
        this.createdAt = createdAt;
        this.lastModified = lastModified;
    }

    public LayerProjection(String nativeCRS, String styleName, String title, String type) {
        this(null,
             title, type,
             null, null,
             false, -1, 75, 0, 0, styleName, nativeCRS,
             null, null, null, null, null,
             null, null, null, null, null,
             null, null, null, null, null);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDataset() {
        return dataset;
    }

    public void setDataset(String dataset) {
        this.dataset = dataset;
    }

    public String getResourceId() {
        return resourceId;
    }

    public void setResourceId(String resourceId) {
        this.resourceId = resourceId;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }

    public int getTransparency() {
        return transparency;
    }

    public void setTransparency(int transparency) {
        this.transparency = transparency;
    }

    public int getMaxZoom() {
        return maxZoom;
    }

    public void setMaxZoom(int maxZoom) {
        this.maxZoom = maxZoom;
    }

    public int getMinZoom() {
        return minZoom;
    }

    public void setMinZoom(int minZoom) {
        this.minZoom = minZoom;
    }

    public String getStyleName() {
        return styleName;
    }

    public void setStyleName(String styleName) {
        this.styleName = styleName;
    }

    public String getNativeCRS() {
        return nativeCRS;
    }

    public void setNativeCRS(String nativeCRS) {
        this.nativeCRS = nativeCRS;
    }

    public String getDataSourceUri() {
        return dataSourceUri;
    }

    public void setDataSourceUri(String dataSourceUri) {
        this.dataSourceUri = dataSourceUri;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getComplexName() {
        return complexName;
    }

    public void setComplexName(String complexName) {
        this.complexName = complexName;
    }

    public String getSourceId() {
        return sourceId;
    }

    public void setSourceId(String sourceId) {
        this.sourceId = sourceId;
    }

    public String getSourceType() {
        return sourceType;
    }

    public void setSourceType(String sourceType) {
        this.sourceType = sourceType;
    }

    public Long getSourceRecordId() {
        return sourceRecordId;
    }

    public void setSourceRecordId(Long sourceRecordId) {
        this.sourceRecordId = sourceRecordId;
    }

    public String getDataStoreName() {
        return dataStoreName;
    }

    public void setDataStoreName(String dataStoreName) {
        this.dataStoreName = dataStoreName;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public String getView() {
        return view;
    }

    public void setView(String view) {
        this.view = view;
    }

    public String getErrorText() {
        return errorText;
    }

    public void setErrorText(String errorText) {
        this.errorText = errorText;
    }

    public String getStyle() {
        return style;
    }

    public void setStyle(String style) {
        this.style = style;
    }

    public String getPhotoMode() {
        return photoMode;
    }

    public void setPhotoMode(String photoMode) {
        this.photoMode = photoMode;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getLastModified() {
        return lastModified;
    }

    public void setLastModified(LocalDateTime lastModified) {
        this.lastModified = lastModified;
    }

    @Override
    public String toString() {
        return "{" +
                "\"id\":" + (id == null ? "null" : "\"" + id + "\"") + ", " +
                "\"title\":" + (title == null ? "null" : "\"" + title + "\"") + ", " +
                "\"type\":" + (type == null ? "null" : "\"" + type + "\"") + ", " +
                "\"dataset\":" + (dataset == null ? "null" : "\"" + dataset + "\"") + ", " +
                "\"resourceId\":" + (resourceId == null ? "null" : "\"" + resourceId + "\"") + ", " +
                "\"enabled\":\"" + enabled + "\"" + ", " +
                "\"position\":" + (position == null ? "null" : "\"" + position + "\"") + ", " +
                "\"transparency\":\"" + transparency + "\"" + ", " +
                "\"maxZoom\":\"" + maxZoom + "\"" + ", " +
                "\"minZoom\":\"" + minZoom + "\"" + ", " +
                "\"styleName\":" + (styleName == null ? "null" : "\"" + styleName + "\"") + ", " +
                "\"nativeCRS\":" + (nativeCRS == null ? "null" : "\"" + nativeCRS + "\"") + ", " +
                "\"dataSourceUri\":" + (dataSourceUri == null ? "null" : "\"" + dataSourceUri + "\"") + ", " +
                "\"parentId\":" + (parentId == null ? "null" : "\"" + parentId + "\"") + ", " +
                "\"projectId\":" + (projectId == null ? "null" : "\"" + projectId + "\"") + ", " +
                "\"complexName\":" + (complexName == null ? "null" : "\"" + complexName + "\"") + ", " +
                "\"sourceId\":" + (sourceId == null ? "null" : "\"" + sourceId + "\"") + ", " +
                "\"sourceType\":" + (sourceType == null ? "null" : "\"" + sourceType + "\"") + ", " +
                "\"sourceRecordId\":" + (sourceRecordId == null ? "null" : "\"" + sourceRecordId + "\"") + ", " +
                "\"dataStoreName\":" + (dataStoreName == null ? "null" : "\"" + dataStoreName + "\"") + ", " +
                "\"contentType\":" + (contentType == null ? "null" : "\"" + contentType + "\"") + ", " +
                "\"view\":" + (view == null ? "null" : "\"" + view + "\"") + ", " +
                "\"errorText\":" + (errorText == null ? "null" : "\"" + errorText + "\"") + ", " +
                "\"style\":" + (style == null ? "null" : "\"" + style + "\"") + ", " +
                "\"photoMode\":" + (photoMode == null ? "null" : "\"" + photoMode + "\"") + ", " +
                "\"createdAt\":" + (createdAt == null ? "null" : createdAt) + ", " +
                "\"lastModified\":" + (lastModified == null ? "null" : lastModified) +
                "}";
    }
}
