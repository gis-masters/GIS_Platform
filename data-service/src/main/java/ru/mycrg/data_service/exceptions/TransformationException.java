package ru.mycrg.data_service.exceptions;

public class TransformationException extends RuntimeException {

    public TransformationException(String msg, Throwable cause) {
        super(msg, cause);
    }

    public TransformationException(String msg) {
        super(msg);
    }
}
