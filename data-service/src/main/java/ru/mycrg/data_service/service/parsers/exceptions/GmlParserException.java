package ru.mycrg.data_service.service.parsers.exceptions;

public class GmlParserException extends RuntimeException {

    public GmlParserException(String msg, Throwable cause) {
        super(msg, cause);
    }

    public GmlParserException(String msg) {
        super(msg);
    }
}
