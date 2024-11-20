package ru.mycrg.data_service.kpt_import.validation;

public class KptImportValidationResult {

    private final KptImportLogLevel level;

    private final String description;

    public KptImportValidationResult(KptImportLogLevel level, String description) {
        this.level = level;
        this.description = description;
    }

    public KptImportLogLevel getLevel() {
        return level;
    }

    public String getDescription() {
        return description;
    }
}
