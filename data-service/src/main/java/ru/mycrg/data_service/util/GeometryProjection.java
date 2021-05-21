package ru.mycrg.data_service.util;

public class GeometryProjection {

    private Integer srid;
    private String wkt;
    private String proj4text;

    public GeometryProjection(Integer srid, String wkt, String proj4text) {
        this.srid = srid;
        this.wkt = wkt;
        this.proj4text = proj4text;
    }

    public GeometryProjection() {
    }

    public Integer getSrid() {
        return srid;
    }

    public void setSrid(Integer srid) {
        this.srid = srid;
    }

    public String getWkt() {
        return wkt;
    }

    public void setWkt(String wkt) {
        this.wkt = wkt;
    }

    public String getProj4text() {
        return proj4text;
    }

    public void setProj4text(String proj4text) {
        this.proj4text = proj4text;
    }
}
