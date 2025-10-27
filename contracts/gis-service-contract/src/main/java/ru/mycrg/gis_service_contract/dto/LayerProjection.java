package ru.mycrg.gis_service_contract.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;
import java.time.LocalDateTime;

public class LayerProjection implements Serializable {

    private final Long id;
    private final String title;
    private final String type;
    private final String dataset;
    private final String resourceId;
    private final boolean enabled;
    private final Integer position;
    private final int transparency;
    private final int maxZoom;
    private final int minZoom;
    private final String styleName;
    private final String nativeCRS;
    private final String dataSourceUri;
    private final Long parentId;
    private final Long projectId;
    private final String complexName;
    private final String sourceId;
    private final String sourceType;
    private final Long sourceRecordId;
    private final String dataStoreName;
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

    // Полный конструктор для программного использования
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

    public String getResourceId() {
        return resourceId;
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

    public String getNativeCRS() {
        return nativeCRS;
    }

    public String getDataSourceUri() {
        return dataSourceUri;
    }

    public Long getParentId() {
        return parentId;
    }

    public Long getProjectId() {
        return projectId;
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
}
