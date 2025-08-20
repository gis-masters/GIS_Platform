package ru.mycrg.gis_service.dto;

// TODO: Не дублировать dto, создать data-service contracts lib.
public class DatasetDataServiceDto {

    private final String name;
    private final String title;
    private final String details;

    public DatasetDataServiceDto(String name, String title, String details) {
        this.name = name;
        this.title = title;
        this.details = details;
    }

    public String getName() {
        return this.name;
    }

    public String getTitle() {
        return title;
    }

    public String getDetails() {
        return details;
    }
}
