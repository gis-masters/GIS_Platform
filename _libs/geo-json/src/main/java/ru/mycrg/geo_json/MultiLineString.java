package ru.mycrg.geo_json;

import java.util.List;

public class MultiLineString extends Geometry<List<LngLatAlt>> {

    public MultiLineString() {
    }

    public MultiLineString(List<LngLatAlt> line) {
        add(line);
    }

    @Override
    public <T> T accept(GeoJsonObjectVisitor<T> geoJsonObjectVisitor) {
        return geoJsonObjectVisitor.visit(this);
    }

    @Override
    public String toString() {
        return "{" +
                "\"type\":" + "\"MultiLineString\"," +
                "\"coordinates\":" + coordinates + ", " +
                "\"crs\":{\"type\":\"name\",\"properties\":{\"name\":\"" + getSrs() + "\"}}" +
                "}";
    }
}
