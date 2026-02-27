package ru.mycrg.report_service.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
public class CarboneUnavailableException extends RuntimeException {

    public CarboneUnavailableException(String message) {
        super(message);
    }
}
