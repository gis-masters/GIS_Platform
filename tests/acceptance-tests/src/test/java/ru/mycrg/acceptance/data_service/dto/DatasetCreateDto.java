package ru.mycrg.acceptance.data_service.dto;

public class DatasetCreateDto {

    private final String title;
    private final String details;
    private final String oktmo;
    private final String docType;
    private final Integer scale;

    public DatasetCreateDto(String title) {
        this(title, "Some description", "", "", 500);
    }

    public DatasetCreateDto(String title, String details, String oktmo, String docType, Integer scale) {
        this.title = title;
        this.details = details;
        this.oktmo = oktmo;
        this.docType = docType;
        this.scale = scale;
    }

    public String getTitle() {
        return title;
    }

    public String getDetails() {
        return details;
    }

    public String getOktmo() {
        return oktmo;
    }

    public String getDocType() {
        return docType;
    }

    public Integer getScale() {
        return scale;
    }
}
