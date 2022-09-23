package ru.mycrg.data_service_contract.dto;

import java.io.Serializable;

public class ProcessModel implements Serializable {

    private Long id;
    private String dbName;

    public ProcessModel() {
        // Required
    }

    public ProcessModel(Long id, String dbName) {
        this.id = id;
        this.dbName = dbName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDbName() {
        return dbName;
    }

    public void setDbName(String dbName) {
        this.dbName = dbName;
    }
}
