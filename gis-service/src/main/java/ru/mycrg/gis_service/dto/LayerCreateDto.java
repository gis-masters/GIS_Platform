package ru.mycrg.gis_service.dto;

import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

public class LayerCreateDto {

    @NotBlank
    @Length(min = 2, max = 255)
    private String title;

    @NotBlank
    @Length(min = 2, max = 255)
    private String dataset;

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
