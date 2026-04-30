package ru.mycrg.cryptopro.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
public class BaseException extends RuntimeException {

    public BaseException(String message) {
        super(message);
    }
}
