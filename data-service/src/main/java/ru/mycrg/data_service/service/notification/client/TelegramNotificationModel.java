package ru.mycrg.data_service.service.notification.client;

// TODO: Пока у нас бардак. Переходной период.
//  Тут описываем модели отдельно от таких же моделей в самом сервисе нотификаций.
public class TelegramNotificationModel {

    private String type;

    /**
     * Не обязательное. Название шаблона в notification-service.
     * <p>
     * При указании несуществующего шаблона сервис будет ругаться BadRequest-ом.
     */
    private String templateName;

    /**
     * Не обязательное. По-умолчанию будет использована "Стандартная".
     * <p>
     * Название стратегии отправки в notification-service.
     * <p>
     * При указании несуществующей стратегии сервис будет ругаться BadRequest-ом.
     */
    private String strategyName;
    private NotificationPayload payload;
    private String createdBy;

    public TelegramNotificationModel(NotificationPayload payload, String createdBy) {
        this.type = "TELEGRAM";
        this.payload = payload;
        this.createdBy = createdBy;
    }

    // Геттеры и сеттеры
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTemplateName() {
        return templateName;
    }

    public void setTemplateName(String templateName) {
        this.templateName = templateName;
    }

    public String getStrategyName() {
        return strategyName;
    }

    public void setStrategyName(String strategyName) {
        this.strategyName = strategyName;
    }

    public NotificationPayload getPayload() {
        return payload;
    }

    public void setPayload(NotificationPayload payload) {
        this.payload = payload;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
}
