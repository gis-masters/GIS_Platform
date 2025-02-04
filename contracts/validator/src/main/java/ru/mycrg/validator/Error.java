package ru.mycrg.validator;

public class Error {

    private final String message;
    private final String field;
    private final Object sourceValue;
    private final String code;

    public Error(String message, String field, Object sourceValue, String code) {
        this.message = message;
        this.field = field;
        this.sourceValue = sourceValue;
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public String getField() {
        return field;
    }

    public Object getSourceValue() {
        return sourceValue;
    }

    public String getCode() {
        return code;
    }
}
