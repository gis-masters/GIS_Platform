package ru.mycrg.data_service.kpt_import.validation;

public class KptImportValidationResult {

    private final KptImportLogLevel level;

    private final String message;

    public KptImportValidationResult(KptImportLogLevel level, String message) {
        this.level = level;
        this.message = message;
    }

    public KptImportLogLevel getLevel() {
        return level;
    }

    public String getMessage() {
        return message;
    }
}
