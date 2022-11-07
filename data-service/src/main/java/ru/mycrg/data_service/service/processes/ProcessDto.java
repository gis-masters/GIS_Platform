package ru.mycrg.data_service.service.processes;

import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.validators.ValidateEnum;
import ru.mycrg.data_service_contract.enums.ProcessType;

import javax.validation.constraints.NotNull;

public class ProcessDto {

    @NotNull
    Object payload;

    @NotNull
    @ValidateEnum(targetClassType = ProcessType.class, message = "Допустимые значения поля type: " +
            "IMPORT, VALIDATION, VALIDATION_REPORT, EXPORT, GEOMETRY_SHAPE")
    String type;

    MultipartFile file;

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

    public MultipartFile getFile() {
        return file;
    }

    public void setFile(MultipartFile file) {
        this.file = file;
    }
}
