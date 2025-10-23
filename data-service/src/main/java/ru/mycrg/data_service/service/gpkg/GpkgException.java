package ru.mycrg.data_service.service.gpkg;

import java.util.HashMap;
import java.util.Map;

public class GpkgException extends RuntimeException {

    private Map<String, String> errors = new HashMap<>();

    public GpkgException(String msg) {
        super(msg);
    }

    public GpkgException(String msg, Map<String, String> errors) {
        super(msg);

        this.errors = errors;
    }

    public GpkgException(String msg, Throwable cause) {
        super(msg, cause);
    }

    public Map<String, String> getErrors() {
        return errors;
    }

    public boolean hasErrors() {
        return !errors.isEmpty();
    }
}
