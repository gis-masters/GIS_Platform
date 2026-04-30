package ru.mycrg.notification.domain.notification.models;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.notification.domain.notification.models.payload.EmailPayload;
import ru.mycrg.notification.domain.notification.models.payload.NotificationPayload;
import ru.mycrg.notification.domain.notification.models.payload.TelegramPayload;
import ru.mycrg.notification.domain.strategy.StrategyEntity;
import ru.mycrg.notification.domain.template.entity.TemplateEntity;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "notifications")
public class NotificationEntity {

    private static final Logger log = LoggerFactory.getLogger(NotificationEntity.class);

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationStatus status;

    private LocalDateTime lastAttemptAt;

    @Column(nullable = false)
    private Integer attemptCount;

    @Column(length = 1000)
    private String errorMessage;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "strategy_id", nullable = false)
    private StrategyEntity strategyEntity;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "template_name")
    private TemplateEntity template;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb", nullable = false)
    private JsonNode payload;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "created_by", nullable = false)
    private String createdBy;

    public NotificationEntity() {
        // Required
    }

    /**
     * Конструктор с параметрами
     */
    public NotificationEntity(Long id, LocalDateTime createdAt, LocalDateTime updatedAt, String createdBy,
                              NotificationStatus status, NotificationType type, LocalDateTime lastAttemptAt,
                              Integer attemptCount, StrategyEntity strategyEntity, TemplateEntity template,
                              JsonNode payload, String errorMessage) {
        this.id = id;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.createdBy = createdBy;
        this.status = status;
        this.type = type;
        this.lastAttemptAt = lastAttemptAt;
        this.attemptCount = attemptCount;
        this.strategyEntity = strategyEntity;
        this.template = template;
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

    public StrategyEntity getStrategy() {
        return strategyEntity;
    }

    public void setStrategy(StrategyEntity strategyEntity) {
        this.strategyEntity = strategyEntity;
    }

    public TemplateEntity getTemplate() {
        return template;
    }

    public void setTemplate(TemplateEntity template) {
        this.template = template;
    }

    public JsonNode getPayload() {
        return payload;
    }

    public void setPayload(JsonNode payload) {
        this.payload = payload;
    }

    // Вспомогательные методы для получения данных из payload

    public String getTemplateName() {
        if (template != null) {
            return template.getName();
        }
        return payload != null && payload.has("template") ? payload.get("template").asText() : null;
    }

    public String getChatId() {
        return payload != null && payload.has("chatId") ? payload.get("chatId").asText() : null;
    }

    public String getProfileName() {
        return payload != null && payload.has("profileName") ? payload.get("profileName").asText() : null;
    }

    public String getEmail() {
        return payload != null && payload.has("email") ? payload.get("email").asText() : null;
    }

    public JsonNode getPropsJson() {
        return payload != null && payload.has("props") ? payload.get("props") : null;
    }

    public List<Property> getProps() {
        try {
            NotificationPayload typedPayload = getTypedPayload();
            if (typedPayload != null) {
                return typedPayload.getProps();
            }
        } catch (Exception e) {
            // Если не удалось получить типизированный payload, используем старый метод
            log.warn("Не удалось получить типизированный payload, используем старый метод.", e);
        }

        // Запасной вариант, если не удалось получить типизированный payload
        JsonNode propsNode = getPropsJson();
        if (propsNode == null || !propsNode.isArray()) {
            return Collections.emptyList();
        }

        List<Property> result = new ArrayList<>();
        ObjectMapper mapper = new ObjectMapper();

        for (JsonNode propNode: propsNode) {
            try {
                Property property = mapper.treeToValue(propNode, Property.class);
                result.add(property);
            } catch (Exception e) {
                // Пропускаем некорректные свойства
                log.warn("Свойства некорректные => пропускаем.");
            }
        }

        return result;
    }

    public <T extends NotificationPayload> T getTypedPayload(Class<T> payloadClass) {
        if (payload == null) {
            return null;
        }

        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.treeToValue(payload, payloadClass);
        } catch (Exception e) {
            return null;
        }
    }

    public NotificationPayload getTypedPayload() {
        if (payload == null) {
            return null;
        }

        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.treeToValue(payload, NotificationPayload.class);
        } catch (Exception e) {
            return null;
        }
    }

    public TelegramPayload getTelegramPayload() {
        return getTypedPayload(TelegramPayload.class);
    }

    public EmailPayload getEmailPayload() {
        return getTypedPayload(EmailPayload.class);
    }

    public JsonNode getFiles() {
        return payload != null && payload.has("files") ? payload.get("files") : null;
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
        NotificationEntity that = (NotificationEntity) o;
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
                "\"strategy\":" + (strategyEntity == null ? "null" : strategyEntity) + ", " +
                "\"template\":" + (template == null ? "null" : "\"" + template.getName() + "\"") + ", " +
                "\"payload\":" + (payload == null ? "null" : "\"" + payload + "\"") + ", " +
                "\"errorMessage\":" + (errorMessage == null ? "null" : "\"" + errorMessage + "\"") +
                "}";
    }

    /**
     * Паттерн Builder для создания объектов Notification
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
        private StrategyEntity strategyEntity;
        private TemplateEntity template;
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

        public Builder strategy(StrategyEntity strategyEntity) {
            this.strategyEntity = strategyEntity;
            return this;
        }

        public Builder template(TemplateEntity template) {
            this.template = template;
            return this;
        }

        public Builder payload(JsonNode payload) {
            this.payload = payload;
            return this;
        }

        // Методы для templateName, chatId и email удалены, так как эти данные теперь хранятся в payload

        public Builder errorMessage(String errorMessage) {
            this.errorMessage = errorMessage;
            return this;
        }

        public NotificationEntity build() {
            return new NotificationEntity(id, createdAt, updatedAt, createdBy, status, type, lastAttemptAt,
                                          attemptCount, strategyEntity, template, payload, errorMessage);
        }
    }

    public static Builder builder() {
        return new Builder();
    }
}
