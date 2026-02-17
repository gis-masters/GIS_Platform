package ru.mycrg.gis_service_contract.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;
import java.time.LocalDateTime;

public class LayerProjection implements Serializable {

    private final Long id;
    private final String title;
    private final String type;
    private String dataset;
    private String resourceId;
    private final boolean enabled;
    private final Integer position;
    private final int transparency;
    private final int maxZoom;
    private final int minZoom;
    private String styleName;
    private final String nativeCRS;
    private final String dataSourceUri;
    private Long parentId;
    private Long projectId;
    private final String complexName;
    private final String sourceId;
    private final String sourceType;
    private final Long sourceRecordId;
    private String dataStoreName;
    private final String contentType;
    private final String view;
    private final String errorText;
    private final String style;
    private final String photoMode;
    private final LocalDateTime createdAt;
    private final LocalDateTime lastModified;

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

    public String getTitle() {
        return title;
    }

    public String getType() {
        return type;
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

    public Integer getPosition() {
        return position;
    }

    public int getTransparency() {
        return transparency;
    }

    public int getMaxZoom() {
        return maxZoom;
    }

    public int getMinZoom() {
        return minZoom;
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

    public String getDataSourceUri() {
        return dataSourceUri;
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

    public String getSourceId() {
        return sourceId;
    }

    public String getSourceType() {
        return sourceType;
    }

    public Long getSourceRecordId() {
        return sourceRecordId;
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

    public String getView() {
        return view;
    }

    public String getErrorText() {
        return errorText;
    }

    public String getStyle() {
        return style;
    }

    public String getPhotoMode() {
        return photoMode;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getLastModified() {
        return lastModified;
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
