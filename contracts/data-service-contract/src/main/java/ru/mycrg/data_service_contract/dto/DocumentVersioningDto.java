package ru.mycrg.data_service_contract.dto;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

public class DocumentVersioningDto {

    private Long updatedBy;
    private LocalDateTime updatedTime;
    private Map<String, Object> content = new HashMap<>();

    public DocumentVersioningDto() {
        // Required
    }

    public DocumentVersioningDto(Long updatedBy, LocalDateTime updatedTime, Map<String, Object> content) {
        this.updatedBy = updatedBy;
        this.updatedTime = updatedTime;
        this.content = content;
    }

    public Long getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(Long updatedBy) {
        this.updatedBy = updatedBy;
    }

    public LocalDateTime getUpdatedTime() {
        return updatedTime;
    }

    public void setUpdatedTime(LocalDateTime updatedTime) {
        this.updatedTime = updatedTime;
    }

    public Map<String, Object> getContent() {
        return content;
    }

    public void setContent(Map<String, Object> content) {
        this.content = content;
    }

    @Override
    public String toString() {
        return "{" +
                "\"updatedBy\":" + (updatedBy == null ? "null" : "\"" + updatedBy + "\"") + ", " +
                "\"updatedTime\":" + (updatedTime == null ? "null" : updatedTime) + ", " +
                "\"content\":" + (content == null ? "null" : "\"" + content + "\"") +
                "}";
    }
}
