package ru.mycrg.data_service.kpt_import.validation;

public class KptImportValidationData {

    private final String cadastralSqare;
    private final String dbName;

    public KptImportValidationData(String cadastralSqare, String dbName) {
        this.cadastralSqare = cadastralSqare;
        this.dbName = dbName;
    }

    public String getCadastralSqare() {
        return cadastralSqare;
    }

    public String getDbName() {
        return dbName;
    }
}
