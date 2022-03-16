package ru.mycrg.geo_json;

public class LineString extends MultiPoint {

    public LineString() {
    }

    public LineString(LngLatAlt... points) {
        super(points);
    }

    @Override
    public <T> T accept(GeoJsonObjectVisitor<T> geoJsonObjectVisitor) {
        return geoJsonObjectVisitor.visit(this);
    }

    @Override
    public String toString() {
        return "{" +
                "\"type\":" + "\"LineString\"," +
                "\"coordinates\":" + coordinates + ", " +
                "\"crs\":{\"type\":\"name\",\"properties\":{\"name\":\"" + getSrs() + "\"}}" +
                "}";
    }
}
