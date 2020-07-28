package ru.mycrg.data_service.controller;

import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import ru.mycrg.data_service.exceptions.CrgExceptionModel;

import java.time.LocalDateTime;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

@ControllerAdvice
public class CrgRestExceptionHandler extends ResponseEntityExceptionHandler {

    private final Environment environment;

    public CrgRestExceptionHandler(Environment environment) {
        this.environment = environment;
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<CrgExceptionModel> handleMaxSizeException(final MaxUploadSizeExceededException ex) {
        String maxUploadSize = environment.getRequiredProperty("spring.servlet.multipart.max-file-size");

        CrgExceptionModel exceptionModel = CrgExceptionModel.builder()
                .timestamp(LocalDateTime.now().toString())
                .status(BAD_REQUEST.value())
                .message("Maximum upload size exceeded, configured maximum: " + maxUploadSize)
                .build();

        return new ResponseEntity<>(exceptionModel, BAD_REQUEST);
    }

}
