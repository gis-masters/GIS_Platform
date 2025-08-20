package ru.mycrg.geoserver_client.exceptions;

public class GeoserverClientException extends RuntimeException {

    public GeoserverClientException(String message) {
        super(message);
    }

    public GeoserverClientException(String message, Throwable cause) {
        super(message, cause);
    }
}
