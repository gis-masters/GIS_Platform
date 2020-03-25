package ru.mycrg.data_service.dto;

public class WMTSSource extends XYZSource {

    /**
     * Имя слоя.
     */
    private String layerName;

    /**
     * Название стиля.
     */
    private String style;

    /**
     * Проекция: "EPSG:900913"
     */
    private String projection;

    /**
     * Формат изображения. По умолчанию 'image/jpeg'.
     */
    private String format;

    public WMTSSource() {
    }

    public String getLayerName() {
        return layerName;
    }

    public void setLayerName(String layerName) {
        this.layerName = layerName;
    }

    public String getStyle() {
        return style;
    }

    public void setStyle(String style) {
        this.style = style;
    }

    public String getProjection() {
        return projection;
    }

    public void setProjection(String projection) {
        this.projection = projection;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }
}
