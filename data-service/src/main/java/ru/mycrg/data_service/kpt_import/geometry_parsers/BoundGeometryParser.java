package ru.mycrg.data_service.kpt_import.geometry_parsers;

import org.postgis.*;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.kpt_import.model.generated.*;

import java.util.*;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.kpt_import.KptImportUtils.hasDifferentNum;
import static ru.mycrg.data_service.kpt_import.KptImportUtils.hasDifferentOrdinates;

@Component
public class BoundGeometryParser {

    public Optional<MultiPolygon> createMultiPolygon(List<BoundContourOut> contours) {
        if (contours == null || contours.isEmpty()) {
            return Optional.empty();
        }

        List<Polygon> polygons = new LinkedList<>();
        for (BoundContourOut contour: contours) {
            List<SpatialElementBound> spatialElements = extractSpatialElements(contour);
            if (!spatialElements.isEmpty()) {
                createPolygon(spatialElements).ifPresent(polygons::add);
            }
        }

        return polygons.isEmpty()
                ? Optional.empty()
                : Optional.of(new MultiPolygon(polygons.toArray(Polygon[]::new)));
    }

    public Optional<MultiLineString> createMultiLineString(List<BoundContourOut> contours) {
        if (contours == null || contours.isEmpty()) {
            return Optional.empty();
        }

        List<LineString> lineStrings = new LinkedList<>();
        for (BoundContourOut contour: contours) {
            List<SpatialElementBound> polylineSpatialElements = extractSpatialElements(contour)
                    .stream()
                    .filter(this::isSpatialElementPolyline)
                    .collect(Collectors.toList());

            List<OrdinateBound> ordinates = polylineSpatialElements.stream()
                                                                   .map(this::extractOrdinates)
                                                                   .flatMap(Collection::stream)
                                                                   .collect(Collectors.toList());

            Optional<LineString> lineString = createLineString(ordinates);
            lineString.ifPresent(lineStrings::add);
        }

        if (lineStrings.isEmpty()) {
            return Optional.empty();
        }

        return Optional.of(new MultiLineString(lineStrings.toArray(LineString[]::new)));
    }

    public Optional<Polygon> createPolygon(List<SpatialElementBound> spatialElements) {
        if (spatialElements == null || spatialElements.isEmpty()) {
            return Optional.empty();
        }

        List<LinearRing> linearRings = new LinkedList<>();
        for (SpatialElementBound spatialElement: spatialElements) {
            List<OrdinateBound> ordinates = extractOrdinates(spatialElement);

            if (!ordinates.isEmpty()) {
                if (hasDifferentOrdinates(ordinates.get(0), ordinates.get(ordinates.size() - 1))) {
                    //самостоятельно "закрываем" полигон, добавляя в конец первую координату
                    ordinates.add(ordinates.get(0));
                }

                List<Point> points = ordinates.stream()
                                              .map(this::createPoint)
                                              .filter(Optional::isPresent)
                                              .map(Optional::get)
                                              .collect(Collectors.toList());
                linearRings.add(new LinearRing(points.toArray(Point[]::new)));
            }
        }

        if (linearRings.isEmpty()) {
            return Optional.empty();
        }

        return Optional.of(new Polygon(linearRings.toArray(LinearRing[]::new)));
    }

    public List<SpatialElementBound> extractSpatialElements(BoundContourOut contour) {
        return Optional.ofNullable(contour.getEntitySpatial())
                       .map(EntitySpatialBound::getSpatialsElements)
                       .map(SpatialsElementsBound::getSpatialElement)
                       .orElse(Collections.emptyList());
    }

    public boolean isSpatialElementPolyline(SpatialElementBound spatialElement) {
        return isOrdinatesPolyline(extractOrdinates(spatialElement));
    }

    public List<OrdinateBound> extractOrdinates(SpatialElementBound spatialElement) {
        return Optional.ofNullable(spatialElement.getOrdinates())
                       .map(OrdinatesBound::getOrdinate)
                       .orElse(Collections.emptyList());
    }

    private Optional<LineString> createLineString(List<OrdinateBound> ordinates) {
        if (ordinates == null || ordinates.isEmpty()) {
            return Optional.empty();
        }

        List<Point> points = ordinates.stream()
                                      .map(this::createPoint)
                                      .filter(Optional::isPresent)
                                      .map(Optional::get)
                                      .collect(Collectors.toList());

        if (ordinates.size() != points.size()) {
            return Optional.empty();
        }

        return Optional.of(new LineString(points.toArray(Point[]::new)));
    }

    private boolean isOrdinatesPolyline(List<OrdinateBound> ordinates) {
        if (ordinates == null || ordinates.size() < 2) {
            return false;
        }

        OrdinateBound first = ordinates.get(0);
        OrdinateBound last = ordinates.get(ordinates.size() - 1);

        return hasDifferentNum(first, last) || hasDifferentOrdinates(first, last);
    }

    private Optional<Point> createPoint(OrdinateBound ordinate) {
        if (ordinate.getX() == null || ordinate.getY() == null) {
            return Optional.empty();
        }

        return Optional.of(new Point(ordinate.getY().doubleValue(), ordinate.getX().doubleValue()));
    }
}
