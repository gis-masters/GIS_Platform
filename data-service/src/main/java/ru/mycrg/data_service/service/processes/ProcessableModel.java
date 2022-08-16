package ru.mycrg.data_service.service.processes;

import ru.mycrg.data_service.validators.ValidateEnum;
import ru.mycrg.data_service_contract.enums.ProcessType;

import javax.validation.constraints.NotNull;

public class ProcessableModel {

    @NotNull
    Object payload;

    @NotNull
    @ValidateEnum(targetClassType = ProcessType.class, message = "Допустимые значения поля type: " +
            "IMPORT, IMPORT_GML, IMPORT_RASTER, VALIDATION, VALIDATION_REPORT, EXPORT")
    String type;

    public ProcessableModel() {
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
