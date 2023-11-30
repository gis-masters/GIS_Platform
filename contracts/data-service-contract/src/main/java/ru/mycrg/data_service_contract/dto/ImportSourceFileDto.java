package ru.mycrg.data_service_contract.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class ImportSourceFileDto {

    private UUID id;
    private String path;
    private LocalDateTime createdAt;

    private TypeDocumentData document;

    public ImportSourceFileDto() {
        //for json deserialization
    }

    public ImportSourceFileDto(UUID id, String path, LocalDateTime createdAt, TypeDocumentData document) {
        this.id = id;
        this.path = path;
        this.createdAt = createdAt;
        this.document = document;
    }

    public UUID getId() {
        return id;
    }

    public String getPath() {
        return path;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public TypeDocumentData getDocument() {
        return document;
    }

    public void setDocument(TypeDocumentData document) {
        this.document = document;
    }
}
