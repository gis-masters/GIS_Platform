package ru.mycrg.gis_service.exceptions;

import org.springframework.http.HttpStatus;

import java.util.Collections;
import java.util.List;

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

    public HttpStatus getStatus() {
        return status;
    }

    public void setStatus(HttpStatus status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<ErrorInfo> getErrors() {
        return errors;
    }

    public void setErrors(List<ErrorInfo> errors) {
        this.errors = errors;
    }
}
