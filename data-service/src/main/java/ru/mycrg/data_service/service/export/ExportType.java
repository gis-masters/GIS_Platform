package ru.mycrg.data_service.service.export;

// TODO: в будущем вернуться к врапперу. пока как есть
public enum ExportType {
    SHAPE("ESRI Shapefile"),
    GML("GML");

    private final String type;

    ExportType(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }
}
