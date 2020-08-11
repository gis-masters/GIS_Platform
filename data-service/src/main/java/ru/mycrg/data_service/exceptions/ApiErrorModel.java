package ru.mycrg.data_service.exceptions;

import lombok.Data;
import org.springframework.http.HttpStatus;

import java.util.Collections;
import java.util.List;

@Data
public class ApiErrorModel {

    private HttpStatus status;
    private String message;
    private List<ErrorInfo> errors;

    public ApiErrorModel(final HttpStatus status, String message, List<ErrorInfo> errors) {
        this.status = status;
        this.message = message;
        this.errors = errors;
    }

    public ApiErrorModel(final HttpStatus status, String message, ErrorInfo error) {
        this.status = status;
        this.message = message;
        this.errors = Collections.singletonList(error);
    }

    public ApiErrorModel(final HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }
}
