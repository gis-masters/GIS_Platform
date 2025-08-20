package ru.mycrg.data_service.dto;

import ru.mycrg.data_service.validators.ValidateEnum;
import ru.mycrg.data_service_contract.enums.ProcessType;

import javax.validation.constraints.NotNull;

public class ProcessDto {

    @NotNull
    Object payload;

    @NotNull
    @ValidateEnum(targetClassType = ProcessType.class, message = "Допустимые значения поля type: " +
            "IMPORT, VALIDATION, VALIDATION_REPORT, EXPORT, IMPORT_GEOMETRY, FULL_TEXT_SEARCH")
    String type;

    public ProcessDto() {
        // Required
    }

    public Object getPayload() {
        return payload;
    }

    public void setPayload(Object payload) {
        this.payload = payload;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
