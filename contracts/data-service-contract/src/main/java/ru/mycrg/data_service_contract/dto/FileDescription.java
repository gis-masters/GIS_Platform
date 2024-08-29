package ru.mycrg.data_service_contract.dto;

import java.util.UUID;

public class FileDescription {

    private UUID id;
    private String title;
    private Long size;

    public FileDescription() {
        // Required
    }

    public FileDescription(UUID id, String title, Long size) {
        this.id = id;
        this.title = title;
        this.size = size;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Long getSize() {
        return size;
    }

    public void setSize(Long size) {
        this.size = size;
    }

    @Override
    public String toString() {
        return "{" +
                "\"id\":" + (id == null ? "null" : "\"" + id + "\"") + ", " +
                "\"title\":" + (title == null ? "null" : "\"" + title + "\"") + ", " +
                "\"size\":" + (size == null ? "null" : "\"" + size + "\"") +
                "}";
    }
}
