package ru.mycrg.data_service.kpt_import.validation;

public class KptImportValidationData {

    private final String cadastralSqare;
    private final String dbName;
    private final long projectId;

    public KptImportValidationData(String cadastralSqare, String dbName, long projectId) {
        this.cadastralSqare = cadastralSqare;
        this.dbName = dbName;
        this.projectId = projectId;
    }

    public String getCadastralSqare() {
        return cadastralSqare;
    }

    public String getDbName() {
        return dbName;
    }

    public long getProjectId() {
        return projectId;
    }
}
