package ru.mycrg.acceptance.data_service.dto;

import java.util.Objects;

public class ErrorInfo {

    private String field;
    private String message;

    public ErrorInfo() {
        // Required
    }

    public ErrorInfo(String field, String message) {
        this.field = field;
        this.message = message;
    }

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        ErrorInfo errorInfo = (ErrorInfo) o;
        return Objects.equals(getField(), errorInfo.getField()) && Objects.equals(getMessage(),
                                                                                  errorInfo.getMessage());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getField(), getMessage());
    }
}
