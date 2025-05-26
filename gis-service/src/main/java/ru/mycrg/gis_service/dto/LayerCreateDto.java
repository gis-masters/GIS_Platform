package ru.mycrg.gis_service.dto;

import org.hibernate.validator.constraints.Length;
import ru.mycrg.gis_service.validators.CrgParentGroup;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

public class LayerCreateDto {

    @NotBlank
    @Pattern(regexp = "^(vector|raster|external|external_geoserver|external_nspd|dxf|shp|tab|mid)$",
             message = "Допустимые значения поля type: vector/raster/external/external_nspd/external_geoserver/dxf/shp/tab/mid")
    private String type;

    @Length(min = 1, max = 255)
    private String title;

    @Length(min = 1, max = 255)
    private String tableName;

    @Length(min = 1, max = 255)
    private String nativeName;

    @Length(min = 1, max = 255)
    private String featureTypeName;

    @Length(min = 1, max = 255)
    private String dataset;

    @Pattern(regexp = "^(true|false)$", message = "Допустимые значения поля enabled: true или false")
    private String enabled;

    @Max(Integer.MAX_VALUE)
    private int position = -1;

    @Min(message = "Минимальное значение прозрачности 5", value = 5)
    @Max(message = "Максимальное значение прозрачности 100", value = 100)
    private int transparency = 75;

    @Min(message = "Минимальное значение 0", value = -1)
    @Max(message = "Максимальное значение 40", value = 40)
    private int minZoom;

    @Min(message = "Минимальное значение 0", value = -1)
    @Max(message = "Максимальное значение 40", value = 40)
    private int maxZoom;

    @CrgParentGroup
    private Long parentId;

    @Length(min = 1, max = 255)
    private String styleName;

    @Length(min = 1, max = 100)
    private String dataStoreName;

    @Length(min = 8, max = 50, message = "Ожидается строка вида: 'EPSG:28406'")
    private String nativeCRS;

    @Length(min = 1, max = 1255)
    private String dataSourceUri;

    @Length(min = 1, max = 255)
    private String libraryId;

    private Long recordId;

    @Pattern(regexp = "^(full|geoserver|gis-service)$",
             message = "Допустимые значения поля role: full, geoserver, gis-service")
    private String mode = "full";

    @Length(max = 50)
    private String contentType;

    private String view;

    private String errorText;

    private String style;

    private String photoMode;

    public LayerCreateDto() {
        //Required by framework
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDataset() {
        return dataset;
    }

    public void setDataset(String dataset) {
        this.dataset = dataset;
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDataStoreName() {
        return dataStoreName;
    }

    public void setDataStoreName(String dataStoreName) {
        this.dataStoreName = dataStoreName;
    }

    public String getEnabled() {
        return this.enabled;
    }

    public void setEnabled(String enabled) {
        this.enabled = enabled;
    }

    public int getPosition() {
        return this.position;
    }

    public void setPosition(int position) {
        this.position = position;
    }

    public int getTransparency() {
        return this.transparency;
    }

    public void setTransparency(int transparency) {
        this.transparency = transparency;
    }

    public int getMinZoom() {
        return this.minZoom;
    }

    public void setMinZoom(int minZoom) {
        this.minZoom = minZoom;
    }

    public int getMaxZoom() {
        return this.maxZoom;
    }

    public void setMaxZoom(int maxZoom) {
        this.maxZoom = maxZoom;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
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

    public String getFeatureTypeName() {
        return featureTypeName;
    }

    public void setFeatureTypeName(String featureTypeName) {
        this.featureTypeName = featureTypeName;
    }

    public String getNativeName() {
        return nativeName;
    }

    public void setNativeName(String nativeName) {
        this.nativeName = nativeName;
    }

    @Override
    public String toString() {
        return "{" +
                "\"type\":" + (type == null ? "null" : "\"" + type + "\"") + ", " +
                "\"title\":" + (title == null ? "null" : "\"" + title + "\"") + ", " +
                "\"tableName\":" + (tableName == null ? "null" : "\"" + tableName + "\"") + ", " +
                "\"nativeName\":" + (nativeName == null ? "null" : "\"" + nativeName + "\"") + ", " +
                "\"featureTypeName\":" + (featureTypeName == null ? "null" : "\"" + featureTypeName + "\"") + ", " +
                "\"dataset\":" + (dataset == null ? "null" : "\"" + dataset + "\"") + ", " +
                "\"enabled\":" + (enabled == null ? "null" : "\"" + enabled + "\"") + ", " +
                "\"position\":\"" + position + "\"" + ", " +
                "\"transparency\":\"" + transparency + "\"" + ", " +
                "\"minZoom\":\"" + minZoom + "\"" + ", " +
                "\"maxZoom\":\"" + maxZoom + "\"" + ", " +
                "\"parentId\":" + (parentId == null ? "null" : "\"" + parentId + "\"") + ", " +
                "\"styleName\":" + (styleName == null ? "null" : "\"" + styleName + "\"") + ", " +
                "\"dataStoreName\":" + (dataStoreName == null ? "null" : "\"" + dataStoreName + "\"") + ", " +
                "\"nativeCRS\":" + (nativeCRS == null ? "null" : "\"" + nativeCRS + "\"") + ", " +
                "\"dataSourceUri\":" + (dataSourceUri == null ? "null" : "\"" + dataSourceUri + "\"") + ", " +
                "\"libraryId\":" + (libraryId == null ? "null" : "\"" + libraryId + "\"") + ", " +
                "\"recordId\":" + (recordId == null ? "null" : "\"" + recordId + "\"") + ", " +
                "\"mode\":" + (mode == null ? "null" : "\"" + mode + "\"") + ", " +
                "\"contentType\":" + (contentType == null ? "null" : "\"" + contentType + "\"") + ", " +
                "\"view\":" + (view == null ? "null" : "\"" + view + "\"") + ", " +
                "\"errorText\":" + (errorText == null ? "null" : "\"" + errorText + "\"") + ", " +
                "\"style\":" + (style == null ? "null" : "\"" + style + "\"") + ", " +
                "\"photoMode\":" + (photoMode == null ? "null" : "\"" + photoMode + "\"") +
                "}";
    }
}
