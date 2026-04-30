package ru.mycrg.cryptopro.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

@RestControllerAdvice
public class CustomRestExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler({BaseException.class})
    public ResponseEntity<ErrorModel> handleBaseException(final BaseException ex) {
        ErrorModel errorModel = new ErrorModel(INTERNAL_SERVER_ERROR, ex.getMessage());

        return new ResponseEntity<>(errorModel, INTERNAL_SERVER_ERROR);
    }
}
