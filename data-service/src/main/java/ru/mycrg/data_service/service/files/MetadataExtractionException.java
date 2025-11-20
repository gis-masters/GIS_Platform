package ru.mycrg.data_service.service.files;

public class MetadataExtractionException extends Exception {

    public MetadataExtractionException(String message) {
        super(message);
    }

    public MetadataExtractionException(String message, Throwable cause) {
        super(message, cause);
    }
}
