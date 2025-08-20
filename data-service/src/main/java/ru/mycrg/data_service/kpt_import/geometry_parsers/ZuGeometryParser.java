package ru.mycrg.data_service.kpt_import.geometry_parsers;

import org.postgis.LinearRing;
import org.postgis.MultiPolygon;
import org.postgis.Point;
import org.postgis.Polygon;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.kpt_import.model.generated.*;

import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.kpt_import.KptImportUtils.hasDifferentOrdinates;

@Component
public class ZuGeometryParser {

    public Optional<MultiPolygon> createMultiPolygon(List<ContourZUZacrep> contours) {
        if (contours == null || contours.isEmpty()) {
            return Optional.empty();
        }

        List<Polygon> polygons = new LinkedList<>();
        for (ContourZUZacrep contour: contours) {
            List<SpatialElementZacrep> spatialElements = extractSpatialElements(contour);
            if (!spatialElements.isEmpty()) {
                createPolygon(spatialElements).ifPresent(polygons::add);
            }
        }

        return polygons.isEmpty()
                ? Optional.empty()
                : Optional.of(new MultiPolygon(polygons.toArray(Polygon[]::new)));
    }

    private Optional<Point> createPoint(OrdinateZacrep ordinate) {
        if (ordinate.getX() == null || ordinate.getY() == null) {
            return Optional.empty();
        }

        return Optional.of(new Point(ordinate.getY().doubleValue(), ordinate.getX().doubleValue()));
    }

    private List<SpatialElementZacrep> extractSpatialElements(ContourZUZacrep contour) {
        return Optional.ofNullable(contour.getEntitySpatial())
                       .map(EntitySpatialZUZacrep::getSpatialsElements)
                       .map(SpatialsElementsZacrep::getSpatialElement)
                       .orElse(Collections.emptyList());
    }

    private List<OrdinateZacrep> extractOrdinates(SpatialElementZacrep spatialElement) {
        return Optional.ofNullable(spatialElement.getOrdinates())
                       .map(OrdinatesZacrep::getOrdinate)
                       .orElse(Collections.emptyList());
    }

    private Optional<Polygon> createPolygon(List<SpatialElementZacrep> spatialElements) {
        if (spatialElements == null || spatialElements.isEmpty()) {
            return Optional.empty();
        }

        List<LinearRing> linearRings = new LinkedList<>();
        for (SpatialElementZacrep spatialElement: spatialElements) {
            List<OrdinateZacrep> ordinates = extractOrdinates(spatialElement);

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
}
