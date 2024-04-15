package ru.mycrg.data_service.service.smev3.model;

/**
 * Статус обработки сообщения из СМЭВ
 */
public enum ProcessMessageStatus {
    SUCCESSFULLY("Успешно обработан и сохранен"),
    ERROR_REJECT("Ошибка доступа"),
    ERROR_NOT_IMPLEMENTED("Метод не реализован"),
    ERROR_STATUS("Статусное сообщение");

    private final String description;

    ProcessMessageStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
