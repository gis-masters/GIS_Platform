package ru.mycrg.acceptance.data_service.dto;

public class DatasetCreateDto {

    private final String name;
    private final String title;
    private final String details;

    public DatasetCreateDto(String name, String title, String details) {
        this.name = name;
        this.title = title;
        this.details = details;
    }

    public String getName() {
        return name;
    }

    public String getTitle() {
        return title;
    }

    public String getDetails() {
        return details;
    }
}
