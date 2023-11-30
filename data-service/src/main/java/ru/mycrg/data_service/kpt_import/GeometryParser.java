package ru.mycrg.data_service.kpt_import;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.LinearRing;
import org.locationtech.jts.geom.Polygon;
import org.postgis.MultiPolygon;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.kpt_import.model.generated.*;
import ru.mycrg.data_service.util.TransformationGeometryUtils;

import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class GeometryParser {

    private final static int SRID = 7829;
    private final GeometryFactory geometryFactory = new GeometryFactory();
    private final TransformationGeometryUtils transformationGeometryUtils;

    public GeometryParser(TransformationGeometryUtils transformationGeometryUtils) {
        this.transformationGeometryUtils = transformationGeometryUtils;
    }

    public Optional<MultiPolygon> createMultiPolygon(List<ContourZUZacrep> contours) {
        if (contours == null || contours.isEmpty()) {
            return Optional.empty();
        }
        var polygons = new LinkedList<Polygon>();
        for (var contour: contours) {
            var spatialElements = Optional.ofNullable(contour.getEntitySpatial())
                                          .map(EntitySpatialZUZacrep::getSpatialsElements)
                                          .map(SpatialsElementsZacrep::getSpatialElement);
            if (spatialElements.isPresent()) {
                var polygon = createPolygon(spatialElements.get());
                polygon.ifPresent(polygons::add);
            }
        }

        if (!polygons.isEmpty()) {
            return Optional.of(transformationGeometryUtils.makeMultiPolygon(polygons, SRID));
        } else {
            return Optional.empty();
        }
    }

    public Optional<Polygon> createPolygon(List<SpatialElementZacrep> spatialElements) {
        if (spatialElements == null || spatialElements.isEmpty()) {
            return Optional.empty();
        }

        var shellCoordinates = getCoordinates(spatialElements.get((0)));
        var shell = geometryFactory.createLinearRing(shellCoordinates.toArray(Coordinate[]::new));

        var holes = new LinkedList<org.locationtech.jts.geom.LinearRing>();
        for (int i = 1; i < spatialElements.size(); i++) {
            var coordinatesOfHole = getCoordinates(spatialElements.get(i));
            if (!coordinatesOfHole.isEmpty()) {
                var hole = geometryFactory.createLinearRing(coordinatesOfHole.toArray(Coordinate[]::new));
                if (hole != null) {
                    holes.add(hole);
                }
            }
        }
        return Optional.ofNullable(geometryFactory.createPolygon(shell, holes.toArray(LinearRing[]::new)));
    }

    public Optional<Coordinate> createCoordinate(OrdinateZacrep ordinate) {
        Coordinate coordinate = null;
        if (ordinate.getX() != null && ordinate.getY() != null) {
            coordinate = new Coordinate(ordinate.getX().doubleValue(), ordinate.getY().doubleValue());
        }
        return Optional.ofNullable(coordinate);
    }

    private boolean isPolygonOrdinates(List<OrdinateZacrep> ordinates) {
        if (ordinates.size() < 3) {
            return false;
        }

        var firstOrdinate = ordinates.get(0);
        var lastOrdinate = ordinates.get(ordinates.size() - 1);

        if (firstOrdinate.getNumGeopoint() != null && lastOrdinate.getNumGeopoint() != null) {
            return firstOrdinate.getNumGeopoint().equals(lastOrdinate.getNumGeopoint());
        }

        return firstOrdinate.getX() != null && firstOrdinate.getY() != null
                && lastOrdinate.getX() != null && lastOrdinate.getY() != null
                && firstOrdinate.getX().equals(lastOrdinate.getX())
                && firstOrdinate.getY().equals(lastOrdinate.getY());
    }

    private List<Coordinate> getCoordinates(SpatialElementZacrep spatialElementZacrep) {
        return Optional.ofNullable(spatialElementZacrep.getOrdinates())
                       .map(OrdinatesZacrep::getOrdinate)
                       .orElse(Collections.emptyList())
                       .stream()
                       .map(this::createCoordinate)
                       .filter(Optional::isPresent)
                       .map(Optional::get)
                       .collect(Collectors.toList());
    }
}
