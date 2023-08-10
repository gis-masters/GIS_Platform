package ru.mycrg.gisog_service_contract.dto;

import java.util.Map;
import java.util.UUID;

public class Document {

    private UUID guid;
    private String name;
    private String contentType;
    private Map<String, Object> content;

    public Document() {
        // Required
    }

    public Document(UUID guid, String name, String contentType, Map<String, Object> content) {
        this.guid = guid;
        this.name = name;
        this.contentType = contentType;
        this.content = content;
    }

    public UUID getGuid() {
        return guid;
    }

    public void setGuid(UUID guid) {
        this.guid = guid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public Map<String, Object> getContent() {
        return content;
    }

    public void setContent(Map<String, Object> content) {
        this.content = content;
    }
}
