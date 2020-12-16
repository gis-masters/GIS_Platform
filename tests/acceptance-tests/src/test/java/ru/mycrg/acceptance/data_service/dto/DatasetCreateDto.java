package ru.mycrg.acceptance.data_service.dto;

public class DatasetCreateDto {

    private final String title;
    private final String details;

    public DatasetCreateDto(String title, String details) {
        this.title = title;
        this.details = details;
    }

    public String getTitle() {
        return title;
    }

    public String getDetails() {
        return details;
    }
}
