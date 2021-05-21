package ru.mycrg.data_service.util;

import org.geotools.geometry.jts.JTS;
import org.geotools.referencing.CRS;
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

@Component
public class TransformationGeometryUtils {

    public static final Logger log = LoggerFactory.getLogger(TransformationGeometryUtils.class);

    private final EpsgCodes epsgCodes;

    public TransformationGeometryUtils(EpsgCodes epsgCodes) {
        this.epsgCodes = epsgCodes;
    }

    /**
     * Transform polygons to correct crs if it necessary and convert to correct geometry type. Calculate source and
     * target coordinate systems, check if transformation to other crs is necessary
     *
     * @param srid            spatial reference identifier
     * @param polygons        list of polygons which was parsed from xml file
     * @param geometryFactory instance of geometryFactory
     *
     * @return multipolygon, which will be put to result map
     *
     * @throws TransformationException if transformation to geometry impossible
     */
    public MultiPolygon multipolygonPreparing(Integer srid,
                                              List<org.locationtech.jts.geom.Polygon> polygons,
                                              GeometryFactory geometryFactory) {
        Geometry geometry = geometryFactory
                .createMultiPolygon(polygons.toArray(org.locationtech.jts.geom.Polygon[]::new));

        MultiPolygon multiPolygon;
        double coordinateXToDefineCRS = polygons.get(0).getCoordinate().x / 100000;

        CoordinateReferenceSystem sourceCRS;
        try {
            // Pulkovo 1963 zone 4
            if (coordinateXToDefineCRS >= 40 && coordinateXToDefineCRS < 50) {
                sourceCRS = CRS.parseWKT(epsgCodes.getProjBySrid(314315).getWkt());
            }
            // Pulkovo 1963 zone 5
            else if (coordinateXToDefineCRS >= 50 && coordinateXToDefineCRS < 60) {
                sourceCRS = CRS.parseWKT(epsgCodes.getProjBySrid(314314).getWkt());
            }
            //Pulkovo 1963 zone 6
            else if (coordinateXToDefineCRS >= 60 && coordinateXToDefineCRS < 70) {
                sourceCRS = CRS.decode("EPSG: 28406");
            } else {
                throw new TransformationException("This coordinate system can't be defined");
            }

            CoordinateReferenceSystem targetCRS;
            if (srid == 314314) {
                targetCRS = CRS.parseWKT(epsgCodes.getProjBySrid(314314).getWkt());
            } else if (srid == 314315) {
                targetCRS = CRS.parseWKT(epsgCodes.getProjBySrid(314315).getWkt());
            } else {
                targetCRS = CRS.decode("EPSG:" + srid);
            }

            //transformation to necessary coordinate system if it needable
            List<Coordinate> coordinates;
            if (!targetCRS.equals(sourceCRS)) {
                coordinates = transformToCoordinateSystem(geometry, sourceCRS, targetCRS);
            } else {
                coordinates = Arrays.asList(geometry.getCoordinates());
            }

            List<Polygon> convertGeometryOfPolygons = convertPolygonListToCorrectGeometryType(polygons, coordinates);
            multiPolygon = new MultiPolygon(convertGeometryOfPolygons.toArray(Polygon[]::new));
            multiPolygon.setSrid(srid);
        } catch (FactoryException | TransformException e) {
            String msg = "Something went wrong while geometry transformation" + e.getMessage();
            log.error(msg);
            throw new TransformationException(msg);
        }

        return multiPolygon;
    }

    public List<Coordinate> transformToCoordinateSystem(Geometry geometry,
                                                        CoordinateReferenceSystem sourceCRS,
                                                        CoordinateReferenceSystem targetCRS)
            throws FactoryException, TransformException {
        List<Coordinate> transformedCoordinates;

        MathTransform mathTransform = CRS.findMathTransform(sourceCRS, targetCRS);
        geometry = JTS.transform(geometry, mathTransform);
        boolean targetCrsIsZone4OrZone5 = targetCRS.equals(CRS.parseWKT(epsgCodes.getProjBySrid(314315).getWkt()))
                || targetCRS.equals(CRS.parseWKT(epsgCodes.getProjBySrid(314314).getWkt()));

        transformedCoordinates = Arrays.stream(geometry.getCoordinates())
                                       .map(coordinate -> targetCrsIsZone4OrZone5
                                               ? new Coordinate(coordinate.y, coordinate.x)
                                               : new Coordinate(coordinate.x, coordinate.y))
                                       .collect(Collectors.toList());

        return transformedCoordinates;
    }

    public List<Polygon> convertPolygonListToCorrectGeometryType(
            List<org.locationtech.jts.geom.Polygon> polygons,
            List<Coordinate> transformCoordinates) {
        List<Polygon> transformedPolygonList = new ArrayList<>();
        int countOfCoordinates = 0;

        for (org.locationtech.jts.geom.Polygon polygon: polygons) {
            int size = polygon.getCoordinates().length;

            List<Coordinate> subList = transformCoordinates.subList(countOfCoordinates, countOfCoordinates + size);
            List<Point> pointsForPolygon = subList.stream()
                                                  .map(coordinate -> new Point(coordinate.y, coordinate.x))
                                                  .collect(Collectors.toList());

            LinearRing linearRing = new LinearRing(pointsForPolygon.toArray(Point[]::new));
            Polygon polygonCreated = new Polygon(new LinearRing[]{linearRing});
            transformedPolygonList.add(polygonCreated);
            countOfCoordinates = countOfCoordinates + size;
        }

        return transformedPolygonList;
    }
}
