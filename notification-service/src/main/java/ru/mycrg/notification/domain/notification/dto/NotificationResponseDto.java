package ru.mycrg.notification.domain.notification.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import ru.mycrg.notification.domain.notification.models.NotificationStatus;
import ru.mycrg.notification.domain.notification.models.NotificationType;
import tools.jackson.databind.JsonNode;

import java.time.LocalDateTime;
import java.util.Objects;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class NotificationResponseDto {

    private Long id;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private NotificationStatus status;
    private NotificationType type;
    private LocalDateTime lastAttemptAt;
    private Integer attemptCount;
    private String strategyName;
    private String templateName;
    private JsonNode payload;
    private String errorMessage;

    public NotificationResponseDto() {
        // Required
    }

    public NotificationResponseDto(Long id, LocalDateTime createdAt, LocalDateTime updatedAt, String createdBy,
                                   NotificationStatus status, NotificationType type, LocalDateTime lastAttemptAt,
                                   Integer attemptCount, String strategyName, String templateName,
                                   JsonNode payload, String errorMessage) {
        this.id = id;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.createdBy = createdBy;
        this.status = status;
        this.type = type;
        this.lastAttemptAt = lastAttemptAt;
        this.attemptCount = attemptCount;
        this.strategyName = strategyName;
        this.templateName = templateName;
        this.payload = payload;
        this.errorMessage = errorMessage;
    }

    // Геттеры и сеттеры
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public NotificationStatus getStatus() {
        return status;
    }

    public void setStatus(NotificationStatus status) {
        this.status = status;
    }

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }

    public LocalDateTime getLastAttemptAt() {
        return lastAttemptAt;
    }

    public void setLastAttemptAt(LocalDateTime lastAttemptAt) {
        this.lastAttemptAt = lastAttemptAt;
    }

    public Integer getAttemptCount() {
        return attemptCount;
    }

    public void setAttemptCount(Integer attemptCount) {
        this.attemptCount = attemptCount;
    }

    public String getStrategyName() {
        return strategyName;
    }

    public void setStrategyName(String strategyName) {
        this.strategyName = strategyName;
    }

    public String getTemplateName() {
        return templateName;
    }

    public void setTemplateName(String templateName) {
        this.templateName = templateName;
    }

    public JsonNode getPayload() {
        return payload;
    }

    public void setPayload(JsonNode payload) {
        this.payload = payload;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        NotificationResponseDto that = (NotificationResponseDto) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "{" +
                "\"id\":" + (id == null ? "null" : "\"" + id + "\"") + ", " +
                "\"createdAt\":" + (createdAt == null ? "null" : createdAt) + ", " +
                "\"updatedAt\":" + (updatedAt == null ? "null" : updatedAt) + ", " +
                "\"createdBy\":" + (createdBy == null ? "null" : "\"" + createdBy + "\"") + ", " +
                "\"status\":" + (status == null ? "null" : status) + ", " +
                "\"type\":" + (type == null ? "null" : type) + ", " +
                "\"lastAttemptAt\":" + (lastAttemptAt == null ? "null" : lastAttemptAt) + ", " +
                "\"attemptCount\":" + (attemptCount == null ? "null" : "\"" + attemptCount + "\"") + ", " +
                "\"strategyName\":" + (strategyName == null ? "null" : "\"" + strategyName + "\"") + ", " +
                "\"templateName\":" + (templateName == null ? "null" : "\"" + templateName + "\"") + ", " +
                "\"payload\":" + (payload == null ? "null" : payload) + ", " +
                "\"errorMessage\":" + (errorMessage == null ? "null" : "\"" + errorMessage + "\"") +
                "}";
    }

    /**
     * Паттерн Builder для создания объектов NotificationResponseDto
     */
    public static class Builder {

        private Long id;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private String createdBy;
        private NotificationStatus status;
        private NotificationType type;
        private LocalDateTime lastAttemptAt;
        private Integer attemptCount;
        private String strategyName;
        private String templateName;
        private JsonNode payload;
        private String errorMessage;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Builder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public Builder createdBy(String createdBy) {
            this.createdBy = createdBy;
            return this;
        }

        public Builder status(NotificationStatus status) {
            this.status = status;
            return this;
        }

        public Builder type(NotificationType type) {
            this.type = type;
            return this;
        }

        public Builder lastAttemptAt(LocalDateTime lastAttemptAt) {
            this.lastAttemptAt = lastAttemptAt;
            return this;
        }

        public Builder attemptCount(Integer attemptCount) {
            this.attemptCount = attemptCount;
            return this;
        }

        public Builder strategyName(String strategyName) {
            this.strategyName = strategyName;
            return this;
        }

        public Builder templateName(String templateName) {
            this.templateName = templateName;
            return this;
        }

        public Builder payload(JsonNode payload) {
            this.payload = payload;
            return this;
        }

        public Builder errorMessage(String errorMessage) {
            this.errorMessage = errorMessage;
            return this;
        }

        public NotificationResponseDto build() {
            return new NotificationResponseDto(id, createdAt, updatedAt, createdBy, status, type, lastAttemptAt,
                                               attemptCount, strategyName, templateName, payload, errorMessage);
        }
    }

    public static Builder builder() {
        return new Builder();
    }
}
