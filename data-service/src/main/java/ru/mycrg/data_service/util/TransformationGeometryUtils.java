package ru.mycrg.data_service.util;

import org.geotools.geometry.jts.JTS;
import org.geotools.referencing.CRS;
import org.jetbrains.annotations.NotNull;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.GeometryFactory;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.crs.CoordinateReferenceSystem;
import org.opengis.referencing.operation.MathTransform;
import org.opengis.referencing.operation.TransformException;
import org.postgis.LinearRing;
import org.postgis.MultiPolygon;
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
import java.util.stream.IntStream;
import java.util.stream.Stream;

import static ru.mycrg.data_service.util.CrsHandler.defineCrsBySrid;
import static ru.mycrg.data_service.util.CrsHandler.defineCrsByX;

@Component
public class TransformationGeometryUtils {

    private final Logger log = LoggerFactory.getLogger(TransformationGeometryUtils.class);

    private final EpsgCodes epsgCodes;
    private final GeometryFactory geometryFactory;

    public TransformationGeometryUtils() {
        this.epsgCodes = new EpsgCodes();
        this.geometryFactory = new GeometryFactory();
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
    public Coordinate[] transform(Geometry geometry,
                                  CoordinateReferenceSystem sourceCRS,
                                  CoordinateReferenceSystem targetCRS) {
        try {
            if (!targetCRS.equals(sourceCRS)) {
                MathTransform mathTransform = CRS.findMathTransform(sourceCRS, targetCRS);
                geometry = JTS.transform(geometry, mathTransform);

                return Arrays.stream(geometry.getCoordinates())
                             .map(coordinate -> isTargetCrsIsZone4OrZone5(targetCRS)
                                     ? new Coordinate(coordinate.x, coordinate.y)
                                     : new Coordinate(coordinate.y, coordinate.x))
                             .collect(Collectors.toList())
                             .toArray(Coordinate[]::new);
            } else {
                return geometry.getCoordinates();
            }
        } catch (FactoryException | TransformException e) {
            String msg = "Что-то пошло не так во время трансформации геометрии " + e.getMessage();
            log.error(msg);
            throw new TransformationException(msg);
        }
    }

    public List<Polygon> convertPolygonListToCorrectGeometryType(List<org.locationtech.jts.geom.Polygon> polygons) {
        return polygons.stream()
                       .map(polygon -> {
                           List<LinearRing> shellWithHoles = new ArrayList<>();
                           Point[] shellPoints = getPoints(Arrays.stream(polygon.getExteriorRing().getCoordinates()));
                           LinearRing shellLinearRing = new LinearRing(shellPoints);
                           shellWithHoles.add(shellLinearRing);
                           IntStream.range(0, polygon.getNumInteriorRing())
                                    .mapToObj(i -> Arrays.stream(polygon.getInteriorRingN(i).getCoordinates()))
                                    .map(this::getPoints)
                                    .map(LinearRing::new)
                                    .forEach(shellWithHoles::add);

                           return new Polygon(shellWithHoles.toArray(LinearRing[]::new));
                       })
                       .collect(Collectors.toList());
    }

    public MultiPolygon makeMultiPolygon(List<org.locationtech.jts.geom.Polygon> polygons, Integer srid) {
        List<org.locationtech.jts.geom.Polygon> transformedPolygons = transformationOfPolygons(polygons, srid);

        List<Polygon> convertGeometryOfPolygons = convertPolygonListToCorrectGeometryType(transformedPolygons);

        MultiPolygon multiPolygon = new MultiPolygon(convertGeometryOfPolygons.toArray(Polygon[]::new));
        multiPolygon.setSrid(srid);

        return multiPolygon;
    }

    @NotNull
    private Point[] getPoints(Stream<Coordinate> holesCoordinates) {
        return holesCoordinates.map(coordinate -> new Point(coordinate.x, coordinate.y))
                               .collect(Collectors.toList())
                               .toArray(Point[]::new);
    }

    public List<org.locationtech.jts.geom.Polygon> transformationOfPolygons(
            List<org.locationtech.jts.geom.Polygon> polygons, int srid) {
        return polygons.stream()
                       .map(polygon -> {
                           Coordinate[] transformExterRingCoord = transform(polygon.getExteriorRing(),
                                                                            defineCrsByX(polygon.getCoordinate().x),
                                                                            defineCrsBySrid(srid));
                           org.locationtech.jts.geom.LinearRing transformedShellRing =
                                   geometryFactory.createLinearRing(transformExterRingCoord);

                           org.locationtech.jts.geom.LinearRing[] transformedHoleRings = getTransformedHoleRings(srid,
                                                                                                                 polygon);

                           return geometryFactory.createPolygon(transformedShellRing, transformedHoleRings);
                       })
                       .collect(Collectors.toList());
    }

    private org.locationtech.jts.geom.LinearRing[] getTransformedHoleRings(int srid,
                                                                           org.locationtech.jts.geom.Polygon polygon) {
        return IntStream.range(0, polygon.getNumInteriorRing())
                        .mapToObj(i -> transform(polygon.getInteriorRingN(i),
                                                 defineCrsByX(polygon.getCoordinate().x),
                                                 defineCrsBySrid(srid)))
                        .map(geometryFactory::createLinearRing)
                        .collect(Collectors.toList())
                        .toArray(org.locationtech.jts.geom.LinearRing[]::new);
    }

    private boolean isTargetCrsIsZone4OrZone5(CoordinateReferenceSystem targetCRS) {
        try {
            return targetCRS.equals(epsgCodes.getCrsBySrid(314315))
                    || targetCRS.equals(epsgCodes.getCrsBySrid(314314));
        } catch (FactoryException e) {
            String msg = "Не удалось вычислить CRS. " + e.getMessage();
            log.debug(msg);
            throw new TransformationException(msg);
        }
    }
}
