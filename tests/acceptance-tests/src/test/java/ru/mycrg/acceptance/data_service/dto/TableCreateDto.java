package ru.mycrg.acceptance.data_service.dto;

public class TableCreateDto {

    private final String name;
    private final String title;
    private final String details;
    private final String crs;
    private final String schemaId;
    private final boolean readyForFts;

    public TableCreateDto(String name, String title, String details, String crs, String schemaId) {
        this.name = name;
        this.title = title;
        this.details = details;
        this.crs = crs;
        this.schemaId = schemaId;
        this.readyForFts = false;
    }

    public TableCreateDto(String name, String title, String details, String crs, String schemaId, boolean readyForFts) {
        this.name = name;
        this.title = title;
        this.details = details;
        this.crs = crs;
        this.schemaId = schemaId;
        this.readyForFts = readyForFts;
    }

    public String getTitle() {
        return title;
    }

    public String getDetails() {
        return details;
    }

    public String getName() {
        return name;
    }

    public String getCrs() {
        return crs;
    }

    public String getSchemaId() {
        return schemaId;
    }

    public boolean isReadyForFts() {
        return readyForFts;
    }
}
