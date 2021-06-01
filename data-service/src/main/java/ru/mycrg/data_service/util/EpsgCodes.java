package ru.mycrg.data_service.util;

import org.geotools.referencing.CRS;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.crs.CoordinateReferenceSystem;

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

    public CoordinateReferenceSystem getCrsBySrid(Integer srid) throws FactoryException {
        return CRS.parseWKT(getProjBySrid(srid).getWkt());
    }
}
