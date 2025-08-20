package ru.mycrg.gis_service.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
public class GisServiceException extends RuntimeException {

    private final List<ErrorInfo> errors = new ArrayList<>();

    public GisServiceException(String msg) {
        super(msg);
    }

    public GisServiceException(String msg, Throwable cause) {
        super(msg, cause);
    }

    public GisServiceException(String msg, Map<String, String> details) {
        super(msg);

        for (Map.Entry<String, String> entry: details.entrySet()) {
            this.errors.add(new ErrorInfo(entry.getKey(), entry.getValue()));
        }
    }

    public List<ErrorInfo> getErrors() {
        return errors;
    }
}
