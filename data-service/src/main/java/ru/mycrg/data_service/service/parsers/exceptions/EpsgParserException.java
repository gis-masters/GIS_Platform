package ru.mycrg.data_service.service.parsers.exceptions;

public class EpsgParserException extends RuntimeException {

    public EpsgParserException(String msg, Throwable cause) {
        super(msg, cause);
    }

    public EpsgParserException(String msg) {
        super(msg);
    }
}
