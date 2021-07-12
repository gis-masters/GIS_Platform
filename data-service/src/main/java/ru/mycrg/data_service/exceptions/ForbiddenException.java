package ru.mycrg.data_service.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.FORBIDDEN)
public class ForbiddenException extends RuntimeException {

    public ForbiddenException() {
        super("You don't have permission to delete this resource");
    }

    public ForbiddenException(String msg) {
        super(msg);
    }
}
