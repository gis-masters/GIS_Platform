package ru.mycrg.data_service_contract.dto;

import java.util.UUID;

public class ImportSourceFileDto {

    private UUID id;
    private String path;
    private TypeDocumentData document;

    public ImportSourceFileDto() {
        //for json deserialization
    }

    public ImportSourceFileDto(UUID id, String path, TypeDocumentData document) {
        this.id = id;
        this.path = path;
        this.document = document;
    }

    public UUID getId() {
        return id;
    }

    public String getPath() {
        return path;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public TypeDocumentData getDocument() {
        return document;
    }

    public void setDocument(TypeDocumentData document) {
        this.document = document;
    }
}
