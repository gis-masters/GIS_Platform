package ru.mycrg.data_service.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import ru.mycrg.data_service.service.smev3.model.SmevRequestMeta;
import ru.mycrg.data_service.service.smev3.model.XmlValidationResult;

/**
 * Ошибка при построении запросов в СМЭВ
 */
@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class SmevRequestException extends RuntimeException {

    private final SmevRequestMeta buildMeta;
    private final XmlValidationResult validationResult;

    public SmevRequestException(String message,
                                SmevRequestMeta buildMeta,
                                XmlValidationResult validationResult) {
        super(message);

        this.buildMeta = buildMeta;
        this.validationResult = validationResult;
    }

    public SmevRequestException(String message) {
        this(message, null, null);
    }

    public SmevRequestMeta getBuildMeta() {
        return buildMeta;
    }

    public XmlValidationResult getValidationResult() {
        return validationResult;
    }

    public static SmevRequestException refValueNotFound(String table, String jsonField, String valueInJson) {
        return new SmevRequestException(String.format("ref not found %s %s %s", table, jsonField, valueInJson));
    }
}
