package ru.mycrg.data_service.service.parsers.model;

import java.util.Set;

public class SimpleFeatureData {

    String schemaName;
    String epsgCode;
    Set<String> typeOfGeometry;

    public String getSchemaName() {
        return schemaName;
    }

    public void setSchemaName(String schemaName) {
        this.schemaName = schemaName;
    }

    public String getEpsgCode() {
        return epsgCode;
    }

    public void setEpsgCode(String epsgCode) {
        this.epsgCode = epsgCode;
    }

    public Set<String> getTypeOfGeometry() {
        return typeOfGeometry;
    }

    public void setTypeOfGeometry(Set<String> typeOfGeometry) {
        this.typeOfGeometry = typeOfGeometry;
    }
}
