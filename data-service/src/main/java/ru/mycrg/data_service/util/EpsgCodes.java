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
        GeometryProjection epsg3857 = new GeometryProjection();
        epsg3857.setSrid(3857);
        epsg3857.setWkt(
                "PROJCS[\"WGS 84 / Pseudo-Mercator\", GEOGCS[\"WGS 84\", DATUM[\"WGS_1984\", " +
                        "SPHEROID[\"WGS 84\",6378137,0]], PRIMEM[\"Greenwich\",0], " +
                        "UNIT[\"degree\",0.0174532925199433]], PROJECTION[\"Mercator_1SP\"], " +
                        "PARAMETER[\"central_meridian\",0], PARAMETER[\"latitude_of_origin\",0], " +
                        "PARAMETER[\"scale_factor\",1], PARAMETER[\"false_easting\",0], " +
                        "PARAMETER[\"false_northing\",0], UNIT[\"metre\",1], " +
                        "AXIS[\"Easting\",EAST], AXIS[\"Northing\",NORTH], AUTHORITY[\"EPSG\",\"3857\"]]");
        epsg3857.setProj4text(
                "+proj=merc +a=6378137 +b=6378137 +lat_ts=0 +lon_0=0 +x_0=0 +y_0=0 +k=1 +units=m " +
                        "+nadgrids=@null +wktext +no_defs");

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

        GeometryProjection epsg28406 = new GeometryProjection();
        epsg28406.setSrid(28406);
        epsg28406.setWkt(
                "PROJCS[\"Pulkovo 1942 / Gauss-Kruger zone 6\", GEOGCS[\"Pulkovo 1942\", DATUM[\"Pulkovo_1942\", " +
                        "SPHEROID[\"Krassowsky 1940\",6378245,298.3, AUTHORITY[\"EPSG\",\"7024\"]], " +
                        "AUTHORITY[\"EPSG\",\"6284\"]], PRIMEM[\"Greenwich\",0, AUTHORITY[\"EPSG\",\"8901\"]], " +
                        "UNIT[\"degree\",0.0174532925199433, AUTHORITY[\"EPSG\",\"9122\"]], AUTHORITY[\"EPSG\",\"4284\"]], " +
                        "PROJECTION[\"Transverse_Mercator\"], PARAMETER[\"latitude_of_origin\",0], " +
                        "PARAMETER[\"central_meridian\",33], PARAMETER[\"scale_factor\",1], " +
                        "PARAMETER[\"false_easting\",6500000], PARAMETER[\"false_northing\",0], " +
                        "UNIT[\"metre\",1, AUTHORITY[\"EPSG\",\"9001\"]], " +
                        "AXIS[\"Northing\",NORTH], AXIS[\"Easting\",EAST], AUTHORITY[\"EPSG\",\"28406\"]]");
        epsg28406.setProj4text("+proj=tmerc +lat_0=0 +lon_0=33 +k=1 +x_0=6500000 +y_0=0 +ellps=krass +units=m +no_defs");

        this.geometryProjections = Arrays.asList(epsg3857, epsg314314, epsg314315, epsg28406);
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

    public boolean isCustomSrid(Integer srid) {
        return geometryProjections.stream().anyMatch(gp -> gp.getSrid().equals(srid));
    }

    public CoordinateReferenceSystem getCrsBySrid(Integer srid) throws FactoryException {
        return CRS.parseWKT(getProjBySrid(srid).getWkt());
    }
}
