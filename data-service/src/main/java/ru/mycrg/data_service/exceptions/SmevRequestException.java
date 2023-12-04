package ru.mycrg.data_service.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Ошибка при построении запросов в СМЭВ
 */
@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
public class SmevRequestException extends RuntimeException {
    public SmevRequestException(String message) {
        super("smev. " + message);
    }

    public static SmevRequestException recordNotFound(String table, Object recId) {
        return new SmevRequestException(String.format("record not found %s %s", table, recId));
    }

    public static SmevRequestException refValueNotFound(String table, String jsonField, String valueInJson) {
        return new SmevRequestException(String.format("ref not found %s %s %s", table, jsonField, valueInJson));
    }

    public static SmevRequestException xmlMapping(String operation, Exception e) {
        return new SmevRequestException(String.format("xml mapping fail in operation %s %s", operation, e.getMessage()));
    }

    public static SmevRequestException attachmentFail(Exception e) {
        return new SmevRequestException(String.format("attachmentFail %s", e.getMessage()));
    }
}
