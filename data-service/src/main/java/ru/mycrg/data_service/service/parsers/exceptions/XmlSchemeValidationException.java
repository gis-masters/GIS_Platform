package ru.mycrg.data_service.service.parsers.exceptions;

public class XmlSchemeValidationException extends RuntimeException {

    public XmlSchemeValidationException(String msg, Throwable cause) {
        super(msg, cause);
    }

    public XmlSchemeValidationException(String msg) {
        super(msg);
    }
}
