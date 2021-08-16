package ru.mycrg.data_service.dto.styles;

import java.util.List;

public class SpatialLiteral {

    private SpatialLiteralType type;
    private List<List<List<Object>>> coordinates;

    public SpatialLiteral() {
        // Required
    }

    public SpatialLiteralType getType() {
        return type;
    }

    public void setType(SpatialLiteralType type) {
        this.type = type;
    }

    public List<List<List<Object>>> getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(List<List<List<Object>>> coordinates) {
        this.coordinates = coordinates;
    }

    @Override
    public String toString() {
        return "{" +
                "\"type\": \"" + type + "\"," +
                "\"coordinates\": " + coordinates +
                '}';
    }
}
