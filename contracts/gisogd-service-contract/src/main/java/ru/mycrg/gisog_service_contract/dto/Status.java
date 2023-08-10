package ru.mycrg.gisog_service_contract.dto;

public enum Status {
    WRONG_FIELDS,           // недостаточно полей для отправки
    WRONG_DATA,            // недостаточно данных для отправки
    OBJECT_NOT_ACCEPTED,  // ГИСОГД РФ не принял объект
    GISOGD_FAILED,       // ГИСОГД РФ недоступен
    SUCCESS
}
