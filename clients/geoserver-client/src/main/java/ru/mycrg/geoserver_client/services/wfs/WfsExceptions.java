package ru.mycrg.geoserver_client.services.wfs;

public class WfsExceptions extends RuntimeException {

    public WfsExceptions(String message) {
        super(message);
    }

    public WfsExceptions(String message, Throwable cause) {
        super(message, cause);
    }
}
