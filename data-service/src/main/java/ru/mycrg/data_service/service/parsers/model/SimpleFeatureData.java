package ru.mycrg.data_service.service.parsers.model;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

public class SimpleFeatureData {

    String schemaName;
    String epsgCode;
    Set<String> geometryTypes = new HashSet<>();

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

    public Set<String> getGeometryTypes() {
        return geometryTypes;
    }

    public void setGeometryTypes(String... geometryTypes) {
        this.geometryTypes.addAll(Arrays.asList(geometryTypes));
    }
}
