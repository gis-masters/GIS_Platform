package ru.mycrg.data_service.service.export;

//Сейчас экспортом ESRI Shapefile занимается Gis-service.
// TODO: вернуть его на обычный /export api
public enum ExportType {
    SHAPE("ESRI Shapefile"),
    GPKG("GPKG"),
    GML("GML");

    private final String type;

    ExportType(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }
}
