package ru.mycrg.geoserver_client.services.wms;

import java.util.List;

public class WmsProperties {

    private String version;
    private String format;
    private Boolean transparent;
    private List<String> complexLayerNames;
    private String crs;
    private List<String> styles;
    private Integer width;
    private Integer height;
    private Double[] bbox;

    public WmsProperties(List<String> complexLayerNames, Double[] bbox) {
        this.complexLayerNames = complexLayerNames;
        this.bbox = bbox;
    }

    public WmsProperties(Boolean transparent,
                         List<String> complexLayerNames,
                         List<String> styles,
                         Integer width,
                         Integer height,
                         Double[] bbox) {
        this.transparent = transparent;
        this.complexLayerNames = complexLayerNames;
        this.styles = styles;
        this.width = width;
        this.height = height;
        this.bbox = bbox;
    }

    public WmsProperties(String version,
                         String format,
                         String crs,
                         boolean transparent,
                         List<String> complexLayerNames,
                         List<String> styles,
                         Integer width,
                         Integer height,
                         Double[] bbox) {
        this(transparent, complexLayerNames, styles, width, height, bbox);

        this.version = version;
        this.format = format;
        this.crs = crs;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public Boolean getTransparent() {
        return transparent;
    }

    public void setTransparent(Boolean transparent) {
        this.transparent = transparent;
    }

    public List<String> getComplexLayerNames() {
        return complexLayerNames;
    }

    public void setComplexLayerNames(List<String> complexLayerNames) {
        this.complexLayerNames = complexLayerNames;
    }

    public String getCrs() {
        return crs;
    }

    public void setCrs(String crs) {
        this.crs = crs;
    }

    public List<String> getStyles() {
        return styles;
    }

    public void setStyles(List<String> styles) {
        this.styles = styles;
    }

    public Double[] getBbox() {
        return bbox;
    }

    public void setBbox(Double[] bbox) {
        this.bbox = bbox;
    }

    public Integer getWidth() {
        return width;
    }

    public void setWidth(Integer width) {
        this.width = width;
    }

    public Integer getHeight() {
        return height;
    }

    public void setHeight(Integer height) {
        this.height = height;
    }
}
