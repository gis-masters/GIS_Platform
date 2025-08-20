package ru.mycrg.gisog_service_contract.dto;

public enum Status {
    NOT_FOUND,              // Не найден объект
    BAD_REQUEST,            // ГИСОГД РФ не принял объект
    INTERNAL_SERVER_ERROR, // Неизвестная ошибка ГИСОГД РФ
    SERVICE_UNAVAILABLE,  // ГИСОГД РФ не доступен
    GISOGD_FAILED,       // Ошибки gisogd-service
    SUCCESS             // Объект принят ГИСОГД РФ с кодом 200
}
