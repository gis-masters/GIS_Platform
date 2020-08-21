package ru.mycrg.mq_queue_contract;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum GeometryType {

    @JsonProperty("Point")
    POINT("Point"),

    @JsonProperty("MultiLineString")
    MULTI_LINE_STRING("MultiLineString"),

    @JsonProperty("MultiPolygon")
    MULTI_POLYGON("MultiPolygon");

    private String geometryType;

    GeometryType(String geometryType) {
        this.geometryType = geometryType;
    }

    public String getType() {
        return geometryType;
    }

    public void setType(String geometryType) {
        this.geometryType = geometryType;
    }
}
