package ru.mycrg.data_service.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.ArrayList;
import java.util.List;

@ResponseStatus(value = HttpStatus.FORBIDDEN)
public class ForbiddenException extends RuntimeException {

    private final List<ErrorInfo> errors = new ArrayList<>();

    public ForbiddenException(String msg) {
        super(msg);
    }

    public ForbiddenException(String msg, List<ErrorInfo> errorInfoList) {
        super(msg);

        errors.addAll(errorInfoList);
    }

    public List<ErrorInfo> getErrors() {
        return errors;
    }
}
