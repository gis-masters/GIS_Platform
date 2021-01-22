package ru.mycrg.gis_service.exceptions;

public class ErrorInfo {

    private String field;
    private String message;

    public ErrorInfo() {
        //Required by framework
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
}
