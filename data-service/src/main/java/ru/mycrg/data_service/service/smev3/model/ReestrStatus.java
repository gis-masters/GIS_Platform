package ru.mycrg.data_service.service.smev3.model;

/**
 * Статус для реестра
 */
public enum ReestrStatus {
    SEND_QUEUE("Отправлен в очередь");

    private final String title;

    ReestrStatus(String title) {
        this.title = title;
    }

    public String getTitle() {
        return title;
    }
}
