package ru.mycrg.gis_service.exceptions;

import java.util.Map;

public class CrgPSqlException extends RuntimeException {

    private final Map<String, String> details;

    public CrgPSqlException(String msg, Map<String, String> stringStringMap) {
        super(msg);

        this.details = stringStringMap;
    }

    public Map<String, String> getDetails() {
        return details;
    }
}
