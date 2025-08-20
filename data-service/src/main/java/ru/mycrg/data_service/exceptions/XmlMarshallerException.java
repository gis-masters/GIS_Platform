package ru.mycrg.data_service.exceptions;

/**
 * Проблемы при маршалинге xml
 */
public class XmlMarshallerException extends RuntimeException {

    public XmlMarshallerException(String message) {
        super(message);
    }

    public static XmlMarshallerException mapping(String operation, Exception e) {
        return new XmlMarshallerException(String.format("xml mapping fail in operation %s %s", operation, e.getMessage()));
    }
}
