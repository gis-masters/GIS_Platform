package ru.mycrg.data_service.kpt_import.geometry_parsers;

import org.postgis.*;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.kpt_import.model.generated.OrdinateOKSOut;
import ru.mycrg.data_service.kpt_import.model.generated.OrdinatesOKSOut;
import ru.mycrg.data_service.kpt_import.model.generated.SpatialElementOKSOut;

import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.kpt_import.KptImportUtils.hasDifferentOrdinates;

@Component
public class OksGeometryParser {

    public Optional<MultiPolygon> createMultiPolygon(List<SpatialElementOKSOut> spatialElements) {
        if (spatialElements == null || spatialElements.isEmpty()) {
            return Optional.empty();
        }

        List<Polygon> polygons = new LinkedList<>();
        for (SpatialElementOKSOut spEl: spatialElements) {
            createPolygon(spEl).ifPresent(polygons::add);
        }

        return polygons.isEmpty()
                ? Optional.empty()
                : Optional.of(new MultiPolygon(polygons.toArray(Polygon[]::new)));
    }

    public Optional<MultiLineString> createMultilineString(List<SpatialElementOKSOut> spatialElementOKSOuts) {
        if (spatialElementOKSOuts == null || spatialElementOKSOuts.isEmpty()) {
            return Optional.empty();
        }

        List<LineString> lineStrings = spatialElementOKSOuts.stream()
                                                            .map(spEl -> createLineString(extractOrdinates(spEl)))
                                                            .filter(Optional::isPresent)
                                                            .map(Optional::get)
                                                            .collect(Collectors.toList());

        if (lineStrings.isEmpty()) {
            return Optional.empty();
        }

        return Optional.of(new MultiLineString(lineStrings.toArray(LineString[]::new)));
    }

    public Optional<MultiPoint> createMultiPoint(List<SpatialElementOKSOut> spatialElementOKSOuts) {
        if (spatialElementOKSOuts == null || spatialElementOKSOuts.isEmpty()) {
            return Optional.empty();
        }

        List<Point> points = spatialElementOKSOuts.stream()
                                                  .map(spEl -> createPoint(extractOrdinates(spEl)))
                                                  .filter(Optional::isPresent)
                                                  .map(Optional::get)
                                                  .collect(Collectors.toList());

        return Optional.of(new MultiPoint(points.toArray(Point[]::new)));
    }

    private Optional<Point> createPoint(List<OrdinateOKSOut> ordinates) {
        if (ordinates == null || ordinates.isEmpty()) {
            return Optional.empty();
        }

        return createPoint(ordinates.get(0));
    }

    private Optional<Point> createPoint(OrdinateOKSOut ordinate) {
        if (ordinate.getX() == null || ordinate.getY() == null) {
            return Optional.empty();
        }

        return Optional.of(new Point(ordinate.getY().doubleValue(), ordinate.getX().doubleValue()));
    }

    private List<OrdinateOKSOut> extractOrdinates(SpatialElementOKSOut spatialElement) {
        return Optional.ofNullable(spatialElement.getOrdinates())
                       .map(OrdinatesOKSOut::getOrdinate)
                       .orElse(Collections.emptyList());
    }

    private Optional<Polygon> createPolygon(SpatialElementOKSOut spatialElement) {
        if (spatialElement == null) {
            return Optional.empty();
        }

        List<OrdinateOKSOut> ordinates = extractOrdinates(spatialElement);
        if (ordinates.isEmpty()) {
            return Optional.empty();
        }

        if (hasDifferentOrdinates(ordinates.get(0), ordinates.get(ordinates.size() - 1))) {
            //самостоятельно "закрываем" полигон, добавляя в конец первую координату
            ordinates.add(ordinates.get(0));
        }

        List<Point> points = ordinates.stream()
                                      .map(it -> new Point(it.getY().doubleValue(), it.getX().doubleValue()))
                                      .collect(Collectors.toList());
        LinearRing linearRing = new LinearRing(points.toArray(Point[]::new));

        return Optional.of(new Polygon(new LinearRing[]{linearRing}));
    }

    private Optional<LineString> createLineString(List<OrdinateOKSOut> ordinates) {
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
}
