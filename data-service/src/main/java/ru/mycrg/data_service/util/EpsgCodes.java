package ru.mycrg.data_service.util;

import java.util.List;

public class EpsgCodes {

    List<GeometryProjection> geometryProjections;

    public EpsgCodes(List<GeometryProjection> geometryProjections) {
        this.geometryProjections = geometryProjections;
    }

    public List<GeometryProjection> getGeometryProjections() {
        return geometryProjections;
    }

    public GeometryProjection getProjBySrid(Integer srid) {
        return geometryProjections.stream().filter(gp -> gp.getSrid().equals(srid)).findFirst().orElseThrow();
    }
}
