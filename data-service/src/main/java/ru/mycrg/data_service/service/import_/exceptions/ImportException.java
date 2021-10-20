package ru.mycrg.data_service.service.import_.exceptions;

public class ImportException extends RuntimeException {

    public ImportException(String msg, Throwable cause) {
        super(msg, cause);
    }

    public ImportException(String msg) {
        super(msg);
    }
}
