package ru.mycrg.data_service_contract.enums;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum GeometryType {

    @JsonProperty("Point")
    POINT("Point"),

    @JsonProperty("MultiLineString")
    MULTI_LINE_STRING("MultiLineString"),

    @JsonProperty("MultiPolygon")
    MULTI_POLYGON("MultiPolygon");

    private final String geometryType;

    GeometryType(String geometryType) {
        this.geometryType = geometryType;
    }

    public String getType() {
        return geometryType;
    }
}
