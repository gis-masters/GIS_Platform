package ru.mycrg.data_service.util;

import org.geotools.referencing.CRS;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.crs.CoordinateReferenceSystem;
import ru.mycrg.data_service.dto.GeometryProjection;

import java.util.Arrays;
import java.util.List;

public class EpsgCodes {

    List<GeometryProjection> geometryProjections;

    public EpsgCodes() {
        GeometryProjection epsg314314 = new GeometryProjection();
        epsg314314.setSrid(314314);
        epsg314314.setWkt(
                "PROJCS[\"Pulkovo 1963 zone 5\", GEOGCS[\"Pulkovo 1942\", DATUM[\"Pulkovo 1942\", SPHEROID[\"Krassowsky 1940\", 6378245.0, 298.3, AUTHORITY[\"EPSG\",\"7024\"]], TOWGS84[43.822, -108.842, -119.585, 1.455, -0.761, 0.737, 0.549], AUTHORITY[\"EPSG\",\"6284\"]], PRIMEM[\"Greenwich\", 0.0, AUTHORITY[\"EPSG\",\"8901\"]], UNIT[\"degree\", 0.017453292519943295], AXIS[\"Geodetic longitude\", EAST], AXIS[\"Geodetic latitude\", NORTH], AUTHORITY[\"EPSG\",\"4284\"]], PROJECTION[\"Transverse_Mercator\"], PARAMETER[\"central_meridian\", 35.5], PARAMETER[\"latitude_of_origin\", 0.0], PARAMETER[\"scale_factor\", 1.0], PARAMETER[\"false_easting\", 5300000.0], PARAMETER[\"false_northing\", -9214.692], UNIT[\"m\", 1.0], AXIS[\"x\", EAST], AXIS[\"y\", NORTH], AUTHORITY[\"EPSG\",\"314314\"]]");
        epsg314314.setProj4text(
                "+proj=tmerc +lat_0=0.0833333333333333  +lon_0=32.5 +k=1 +x_0=4300000 +y_0=0 +ellps=krass +towgs84=43.822,-108.842,-119.585,1.455,-0.761,0.737,0.549 +units=m +no_defs");

        GeometryProjection epsg314315 = new GeometryProjection();
        epsg314315.setSrid(314315);
        epsg314315.setWkt(
                "PROJCS[\"Pulkovo 1963 zone 4\", GEOGCS[\"Pulkovo 1942\", DATUM[\"Pulkovo 1942\", SPHEROID[\"Krassowsky 1940\", 6378245.0, 298.3, AUTHORITY[\"EPSG\",\"7024\"]], TOWGS84[43.822, -108.842, -119.585, 1.455, -0.761, 0.737, 0.549], AUTHORITY[\"EPSG\",\"6284\"]], PRIMEM[\"Greenwich\", 0.0, AUTHORITY[\"EPSG\",\"8901\"]], UNIT[\"degree\", 0.017453292519943295], AXIS[\"Geodetic longitude\", EAST], AXIS[\"Geodetic latitude\", NORTH], AUTHORITY[\"EPSG\",\"4284\"]], PROJECTION[\"Transverse_Mercator\"], PARAMETER[\"central_meridian\", 32.5], PARAMETER[\"latitude_of_origin\", 0.0], PARAMETER[\"scale_factor\", 1.0], PARAMETER[\"false_easting\", 4300000.0], PARAMETER[\"false_northing\", -9214.692], UNIT[\"m\", 1.0], AXIS[\"x\", EAST], AXIS[\"y\", NORTH], AUTHORITY[\"EPSG\",\"314315\"]]");
        epsg314315.setProj4text(
                "+proj=tmerc +lat_0=0.0833333333333333  +lon_0=35.5 +k=1 +x_0=4300000 +y_0=0 +ellps=krass +towgs84=43.822,-108.842,-119.585,1.455,-0.761,0.737,0.549 +units=m +no_defs");

        this.geometryProjections = Arrays.asList(epsg314314, epsg314315);
    }

    public List<GeometryProjection> getGeometryProjections() {
        return geometryProjections;
    }

    public void setGeometryProjections(List<GeometryProjection> geometryProjections) {
        this.geometryProjections = geometryProjections;
    }

    public GeometryProjection getProjBySrid(Integer srid) {
        return geometryProjections.stream().filter(gp -> gp.getSrid().equals(srid)).findFirst().orElseThrow();
    }

    public CoordinateReferenceSystem getCrsBySrid(Integer srid) throws FactoryException {
        return CRS.parseWKT(getProjBySrid(srid).getWkt());
    }
}
