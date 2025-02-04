package ru.mycrg.data_service.service.parsers.exceptions;

public class XmlParserException extends RuntimeException {

    public XmlParserException(String msg, Throwable cause) {
        super(msg, cause);
    }

    public XmlParserException(String msg) {
        super(msg);
    }
}
