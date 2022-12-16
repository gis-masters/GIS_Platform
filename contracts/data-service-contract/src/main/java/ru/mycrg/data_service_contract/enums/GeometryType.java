package ru.mycrg.data_service_contract.enums;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum GeometryType {

    @JsonProperty("Point")
    POINT("Point"),

    @JsonProperty("MultiPoint")
    MULTI_POINT("MultiPoint"),

    @JsonProperty("MultiLineString")
    MULTI_LINE_STRING("MultiLineString"),

    @JsonProperty("LineString")
    LINE_STRING("LineString"),

    @JsonProperty("Polygon")
    POLYGON("Polygon"),

    @JsonProperty("MultiPolygon")
    MULTI_POLYGON("MultiPolygon"),

    @JsonProperty("GeometryCollection")
    GEOMETRY_COLLECTION("GeometryCollection");

    private final String geometryType;

    GeometryType(String geometryType) {
        this.geometryType = geometryType;
    }

    public String getType() {
        return geometryType;
    }
}
