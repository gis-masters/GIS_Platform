package ru.mycrg.data_service.exceptions;

import org.springframework.http.HttpStatus;
import ru.mycrg.data_service.service.smev3.model.XmlBuildMeta;
import ru.mycrg.data_service.service.smev3.model.XmlValidationResult;

public class ApiSmevErrorModel extends ApiErrorModel{

    private final XmlBuildMeta buildMeta;
    private final XmlValidationResult validationResult;

    public ApiSmevErrorModel(HttpStatus status,
                             String message,
                             XmlBuildMeta buildMeta,
                             XmlValidationResult validationResult) {
        super(status, message);
        this.buildMeta = buildMeta;
        this.validationResult = validationResult;
    }

    public XmlBuildMeta getBuildMeta() {
        return buildMeta;
    }

    public XmlValidationResult getValidationResult() {
        return validationResult;
    }
}
