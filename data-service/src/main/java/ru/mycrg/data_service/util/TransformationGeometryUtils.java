package ru.mycrg.data_service.util;

import org.geotools.geometry.jts.JTS;
import org.geotools.referencing.CRS;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.Geometry;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.crs.CoordinateReferenceSystem;
import org.opengis.referencing.operation.MathTransform;
import org.opengis.referencing.operation.TransformException;
import org.postgis.LinearRing;
import org.postgis.Point;
import org.postgis.Polygon;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.exceptions.TransformationException;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class TransformationGeometryUtils {

    private static final Logger log = LoggerFactory.getLogger(TransformationGeometryUtils.class);

    private final EpsgCodes epsgCodes;

    public TransformationGeometryUtils(EpsgCodes epsgCodes) {
        this.epsgCodes = epsgCodes;
    }

    /**
     * Transform geometry to correct crs if it necessary, if zone the same - returns input coordinates.
     *
     * @param geometry  geometry need to be transformed
     * @param sourceCRS source coordinate system
     * @param targetCRS target coordinate system
     *
     * @return transformed list of coordinates
     *
     * @throws TransformationException if transformation to geometry impossible
     */
    public List<Coordinate> transform(Geometry geometry,
                                      CoordinateReferenceSystem sourceCRS,
                                      CoordinateReferenceSystem targetCRS) {
        try {
            if (!targetCRS.equals(sourceCRS)) {
                List<Coordinate> transformedCoordinates;

                MathTransform mathTransform = CRS.findMathTransform(sourceCRS, targetCRS);
                geometry = JTS.transform(geometry, mathTransform);
                boolean targetCrsIsZone4OrZone5 = targetCRS.equals(
                        epsgCodes.getCrsBySrid(314315))
                        || targetCRS.equals(epsgCodes.getCrsBySrid(314314));

                transformedCoordinates = Arrays.stream(geometry.getCoordinates())
                                               .map(coordinate -> targetCrsIsZone4OrZone5
                                                       ? new Coordinate(coordinate.x, coordinate.y)
                                                       : new Coordinate(coordinate.y, coordinate.x))
                                               .collect(Collectors.toList());

                return transformedCoordinates;
            } else {
                return Arrays.asList(geometry.getCoordinates());
            }
        } catch (FactoryException | TransformException e) {
            String msg = "Something went wrong while geometry transformation" + e.getMessage();
            log.error(msg);
            throw new TransformationException(msg);
        }
    }

    public List<Polygon> convertPolygonListToCorrectGeometryType(List<org.locationtech.jts.geom.Polygon> polygons,
                                                                 List<Coordinate> transformCoordinates) {
        List<Polygon> transformedPolygonList = new ArrayList<>();
        int countOfCoordinates = 0;

        for (org.locationtech.jts.geom.Polygon polygon: polygons) {
            int size = polygon.getCoordinates().length;

            List<Coordinate> subList = transformCoordinates.subList(countOfCoordinates, countOfCoordinates + size);

            List<Point> pointsForPolygon = subList.stream()
                                                  .map(coordinate -> new Point(coordinate.x, coordinate.y))
                                                  .collect(Collectors.toList());

            LinearRing linearRing = new LinearRing(pointsForPolygon.toArray(Point[]::new));
            Polygon polygonCreated = new Polygon(new LinearRing[]{linearRing});
            transformedPolygonList.add(polygonCreated);
            countOfCoordinates = countOfCoordinates + size;
        }

        return transformedPolygonList;
    }
}
