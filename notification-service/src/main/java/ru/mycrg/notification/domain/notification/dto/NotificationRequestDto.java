package ru.mycrg.notification.domain.notification.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import ru.mycrg.notification.domain.notification.models.NotificationType;
import ru.mycrg.notification.validation.ValidNotificationPayload;

import java.util.Objects;

@JsonInclude(JsonInclude.Include.NON_NULL)
@ValidNotificationPayload
public class NotificationRequestDto {

    @NotNull(message = "Тип уведомления должен быть указан")
    private NotificationType type;

    @NotNull(message = "Полезная нагрузка не может быть пустой")
    private Object payload;

    @NotBlank(message = "Создатель уведомления должен быть указан")
    private String createdBy;

    private String strategyName;

    private String templateName;

    public NotificationRequestDto() {
        // Required
    }

    public NotificationRequestDto(String createdBy, String strategyName, String templateName, Object payload,
                                  NotificationType type) {
        this.createdBy = createdBy;
        this.strategyName = strategyName;
        this.templateName = templateName;
        this.payload = payload;
        this.type = type;
    }

    // Геттеры и сеттеры
    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
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

    public Object getPayload() {
        return payload;
    }

    public void setPayload(Object payload) {
        this.payload = payload;
    }

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        NotificationRequestDto that = (NotificationRequestDto) o;

        return Objects.equals(createdBy, that.createdBy) &&
                Objects.equals(strategyName, that.strategyName) &&
                Objects.equals(templateName, that.templateName) &&
                Objects.equals(payload, that.payload) &&
                type == that.type;
    }

    @Override
    public int hashCode() {
        return Objects.hash(createdBy, strategyName, templateName, payload, type);
    }

    @Override
    public String toString() {
        return "{" +
                "\"createdBy\":" + (createdBy == null ? "null" : "\"" + createdBy + "\"") + ", " +
                "\"strategyName\":" + (strategyName == null ? "null" : "\"" + strategyName + "\"") + ", " +
                "\"templateName\":" + (templateName == null ? "null" : "\"" + templateName + "\"") + ", " +
                "\"payload\":" + (payload == null ? "null" : "\"" + payload + "\"") + ", " +
                "\"type\":" + (type == null ? "null" : type) + ", " +
                "}";
    }

    /**
     * Паттерн Builder для создания объектов NotificationRequestDto
     */
    public static class Builder {

        private String createdBy;
        private String strategyName;
        private String templateName;
        private Object payload;
        private NotificationType type;

        public Builder createdBy(String createdBy) {
            this.createdBy = createdBy;
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

        public Builder payload(Object payload) {
            this.payload = payload;
            return this;
        }

        public Builder type(NotificationType type) {
            this.type = type;
            return this;
        }

        public NotificationRequestDto build() {
            return new NotificationRequestDto(createdBy, strategyName, templateName, payload, type);
        }
    }

    public static Builder builder() {
        return new Builder();
    }
}
