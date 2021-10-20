package ru.mycrg.data_service.service.processes.dto;

import ru.mycrg.data_service.validators.ValidateEnum;
import ru.mycrg.data_service_contract.enums.ProcessType;

import javax.validation.constraints.NotNull;

public class ProcessDataModel<T> {

    @NotNull
    @ValidateEnum(targetClassType = ProcessType.class,
                  message = "Please provide ProcessType: IMPORT,IMPORT_GML,VALIDATION,VALIDATION_REPORT,EXPORT")
    private String type;

    private T payload;

    public ProcessDataModel() {
        // Required
    }

    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public T getPayload() {
        return payload;
    }

    public void setPayload(T payload) {
        this.payload = payload;
    }
}
