package ru.mycrg.data_service_contract.dto;

public class SchemaChild {

    private String library;
    private String contentType;

    public SchemaChild() {
        // Required
    }

    public String getLibrary() {
        return library;
    }

    public void setLibrary(String library) {
        this.library = library;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }
}
