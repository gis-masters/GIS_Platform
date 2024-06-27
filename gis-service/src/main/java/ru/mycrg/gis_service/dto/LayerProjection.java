package ru.mycrg.gis_service.dto;

import ru.mycrg.gis_service.entity.Layer;

import static ru.mycrg.common_utils.CrgGlobalProperties.buildGeoserverComplexLayerName;
import static ru.mycrg.gis_service.service.geoserver.FeatureUtil.buildGeoserverFeatureName;

public class LayerProjection {

    private final Long id;
    private final String title;
    private final String type;
    private final String dataset;
    private final String tableName;
    private final boolean enabled;
    private final Integer position;
    private final int transparency;
    private final int maxZoom;
    private final int minZoom;
    private final String styleName;
    private final String nativeCRS;
    private final String dataSourceUri;
    private final Long parentId;
    private final String complexName;
    private final String libraryId;
    private final Long recordId;
    private final String dataStoreName;
    private final String contentType;
    private final String view;
    private final String errorText;
    private final String style;
    private final String photoMode;

    public LayerProjection(Layer layer, String orgWorkspaceName) {
        this.id = layer.getId();
        this.title = layer.getTitle();
        this.type = layer.getType();
        this.dataset = layer.getDataset();
        this.tableName = layer.getTableName();
        this.enabled = layer.isEnabled();
        this.position = layer.getPosition();
        this.transparency = layer.getTransparency();
        this.maxZoom = layer.getMaxZoom();
        this.minZoom = layer.getMinZoom();
        this.styleName = layer.getStyleName();
        this.nativeCRS = layer.getNativeCRS();
        this.dataSourceUri = layer.getDataSourceUri();
        this.parentId = layer.getParent() != null ? layer.getParent().getId() : null;
        this.libraryId = layer.getLibraryId();
        this.recordId = layer.getRecordId();
        this.dataStoreName = layer.getDataStoreName();

        this.complexName = buildGeoserverComplexLayerName(orgWorkspaceName,
                                                          buildGeoserverFeatureName(tableName, nativeCRS));

        this.contentType = layer.getContentType();
        this.view = layer.getView();
        this.errorText = layer.getErrorText();
        this.style = layer.getStyle();
        this.photoMode = layer.getPhotoMode();
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

    public String getTableName() {
        return tableName;
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

    public String getComplexName() {
        return complexName;
    }

    public String getLibraryId() {
        return libraryId;
    }

    public Long getRecordId() {
        return recordId;
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
}
