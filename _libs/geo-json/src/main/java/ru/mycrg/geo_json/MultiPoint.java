package ru.mycrg.geo_json;

public class MultiPoint extends Geometry<LngLatAlt> {

    public MultiPoint() {
    }

    public MultiPoint(LngLatAlt... points) {
        super(points);
    }

    @Override
    public <T> T accept(GeoJsonObjectVisitor<T> geoJsonObjectVisitor) {
        return geoJsonObjectVisitor.visit(this);
    }

    @Override
    public String toString() {
        return "{" +
                "\"type\":" + "\"MultiPoint\"," +
                "\"coordinates\":" + coordinates + ", " +
                "\"crs\":{\"type\":\"name\",\"properties\":{\"name\":\"" + getSrs() + "\"}}" +
                "}";
    }
}
