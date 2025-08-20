package ru.mycrg.gis_service.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class ShapeFileProcessingException extends RuntimeException {

    public ShapeFileProcessingException(String msg) {
        super(msg);
    }
}
