package ru.mycrg.geoserver_client.services.styles.models;

public class GeoserverStyleResponse {

    private Style style;

    public GeoserverStyleResponse(Style style) {
        this.style = style;
    }

    public Style getStyle() {
        return style;
    }

    public void setStyle(Style style) {
        this.style = style;
    }
}
