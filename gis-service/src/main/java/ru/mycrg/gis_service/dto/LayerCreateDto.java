package ru.mycrg.gis_service.dto;

import org.hibernate.validator.constraints.Length;
import ru.mycrg.gis_service.validators.CrgParentGroup;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

public class LayerCreateDto {

    @NotBlank
    @Length(min = 2, max = 255)
    private String title;

    @NotBlank
    @Length(min = 2, max = 255)
    private String dataset;

    @Pattern(regexp = "^(true|false)$", message = "Допустимые значения поля enabled: true или false")
    private String enabled;

    @Min(message = "Минимальное допустимое значение -1", value = -1)
    @Max(Integer.MAX_VALUE)
    private int position = -1;

    @Min(message = "Минимальное значение прозрачности 0", value = -1)
    @Max(message = "Максимальное значение прозрачности 100", value = 100)
    private int transparency = 70;

    @Min(message = "Минимальное значение 0", value = -1)
    @Max(message = "Максимальное значение 40", value = 40)
    private int minZoom;

    @Min(message = "Минимальное значение 0", value = -1)
    @Max(message = "Максимальное значение 40", value = 40)
    private int maxZoom;

    @CrgParentGroup
    private Long parentId;

    @NotBlank
    @Length(min = 2, max = 255)
    private String tableName;

    @Length(min = 2, max = 255)
    private String styleName;

    @NotBlank
    @Pattern(regexp = "^(vector|raster|external)$", message = "Допустимые значения поля type: vector/raster/external")
    private String type;

    @Length(min = 2, max = 100)
    private String schemaId;

    @Length(min = 3, max = 100)
    private String dataStoreName;

    @Length(min = 8, max = 50, message = "Ожидается строка вида: 'EPSG:28406'")
    private String nativeCRS;

    @Length(min = 6, max = 255)
    private String dataSourceUri;

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

    public String getSchemaId() {
        return schemaId;
    }

    public void setSchemaId(String schemaId) {
        this.schemaId = schemaId;
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

    public void setPosition(
            int position) {
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

    public void setMinZoom(
            int minZoom) {
        this.minZoom = minZoom;
    }

    public int getMaxZoom() {
        return this.maxZoom;
    }

    public void setMaxZoom(
            int maxZoom) {
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
}
