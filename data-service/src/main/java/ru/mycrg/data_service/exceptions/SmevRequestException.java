package ru.mycrg.data_service.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.service.smev3.model.XmlBuildMeta;
import ru.mycrg.data_service.service.smev3.model.XmlValidationResult;

/**
 * Ошибка при построении запросов в СМЭВ
 */
@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class SmevRequestException extends RuntimeException {

    private final XmlBuildMeta buildMeta;
    private final XmlValidationResult validationResult;

    public SmevRequestException(String message,
                                XmlBuildMeta buildMeta,
                                XmlValidationResult validationResult) {
        super("Ошибка запроса в СМЭВ: " + message);
        this.buildMeta = buildMeta;
        this.validationResult = validationResult;
    }

    public SmevRequestException(String message) {
        this(message, null, null);
    }

    public XmlBuildMeta getBuildMeta() {
        return buildMeta;
    }

    public XmlValidationResult getValidationResult() {
        return validationResult;
    }

    public static SmevRequestException crgDaoException(CrgDaoException e) {
        return new SmevRequestException("CrgDaoException " + e.getMessage());
    }

    public static SmevRequestException recordNotFound(String table, Object recId) {
        return new SmevRequestException(String.format("record not found %s %s", table, recId));
    }

    public static SmevRequestException refValueNotFound(String table, String jsonField, String valueInJson) {
        return new SmevRequestException(String.format("ref not found %s %s %s", table, jsonField, valueInJson));
    }

    public static SmevRequestException attachmentFail(Exception e) {
        return new SmevRequestException(String.format("attachmentFail %s", e.getMessage()));
    }
}
