package ru.mycrg.gis.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class FileNotFoundException extends RuntimeException {

    public FileNotFoundException(String msg) {
        super(msg);
    }

    public FileNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
