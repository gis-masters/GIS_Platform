package ru.mycrg.acceptance.data_service.dto;

import java.util.ArrayList;
import java.util.List;

public class Geometry {

    private final String type;
    private final List<Object> coordinates;

    public Geometry() {
        this.type = "MultiPolygon";
        this.coordinates = new ArrayList<>();
    }

    public String getType() {
        return type;
    }

    public Object getCoordinates() {
        return coordinates;
    }
}
