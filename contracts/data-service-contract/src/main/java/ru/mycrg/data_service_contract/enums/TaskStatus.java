package ru.mycrg.data_service_contract.enums;

public enum TaskStatus {
    CREATED("создана"),
    CANCELED("отменена"),
    DONE("выполнена"),
    IN_PROGRESS("в работе");

    private final String translatedStatus;

    TaskStatus(String translatedStatus) {
        this.translatedStatus = translatedStatus;
    }

    public String getTranslatedStatus() {
        return translatedStatus;
    }
}
