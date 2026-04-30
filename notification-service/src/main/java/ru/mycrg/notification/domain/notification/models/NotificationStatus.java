package ru.mycrg.notification.domain.notification.models;

public enum NotificationStatus {
    /**
     * Создано, ожидает отправки
     */
    CREATED,

    /**
     * В процессе отправки
     */
    PROCESSING,

    /**
     * Успешно доставлено
     */
    DELIVERED,

    /**
     * Не удалось доставить (после всех попыток)
     */
    FAILED,

    /**
     * Отменено
     */
    CANCELLED
}
