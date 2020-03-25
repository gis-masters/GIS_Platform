package ru.mycrg.data_service.dto;

public class XYZSource {

    /**
     * Тип источника
     */
    private SourceType type;

    /**
     * URL сервиса.
     */
    private String url;

    public XYZSource() {
        this.type = SourceType.OSM;
    }

    public XYZSource(SourceType type, String url) {
        this.type = type;
        this.url = url;
    }

    public SourceType getType() {
        return type;
    }

    public void setType(SourceType type) {
        this.type = type;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
