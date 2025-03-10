package ru.mycrg.acceptance.data_service.dto;

import java.util.UUID;

public class FileDescriptionModel {

    private UUID id;
    private Long size;
    private String title;

    public FileDescriptionModel(UUID id, Long size, String title) {
        this.id = id;
        this.size = size;
        this.title = title;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Long getSize() {
        return size;
    }

    public void setSize(Long size) {
        this.size = size;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String asJson() {
        return "{" +
                "\"size\":" + (size == null ? "null" : size) + ", " +
                "\"id\":" + (id == null ? "null" : "\"" + id + "\"") + ", " +
                "\"title\":" + (title == null ? "null" : "\"" + title + "\"") +
                "}";
    }
}
