package ru.mycrg.data_service.dao.utils.query_builder.rule_handlers;

import com.healthmarketscience.sqlbuilder.Condition;
import com.healthmarketscience.sqlbuilder.CustomCondition;
import com.healthmarketscience.sqlbuilder.CustomSql;
import org.locationtech.jts.geom.*;
import org.opengis.referencing.operation.TransformException;
import ru.mycrg.data_service.dto.styles.RuleFilter;
import ru.mycrg.data_service.dto.styles.SpatialLiteral;
import ru.mycrg.data_service.dto.styles.SpatialRuleFilter;

import java.util.Arrays;
import java.util.List;
import java.util.stream.IntStream;

import static ru.mycrg.data_service.config.CrgCommonConfig.DEFAULT_SRID_DEGREE;
import static ru.mycrg.data_service.dto.styles.SpatialLiteralType.MULTIPOLYGON;

public class SpatialRuleMapper implements RuleMapper {

    private static final double WEB_MERCATOR_RADIUS = 6378137d;
    private final GeometryFactory geometryFactory;

    public SpatialRuleMapper() {
        this.geometryFactory = new GeometryFactory();
    }

    @Override
    public Condition map(RuleFilter ruleFilter) throws TransformException {
        final SpatialRuleFilter filter = (SpatialRuleFilter) ruleFilter;
        final SpatialLiteral spatialLiteral = filter.getLiteral();

        if (!spatialLiteral.getType().equals(MULTIPOLYGON)) {
            throw new TransformException("Support only MULTIPOLYGON yet");
        }

        final Polygon[] polygons = extractPolygons(spatialLiteral.getCoordinates());
        final MultiPolygon transformed = geometryFactory.createMultiPolygon(polygons);
        transformed.setSRID(Integer.parseInt(DEFAULT_SRID_DEGREE));

        return new CustomCondition(
                new CustomSql(
                        String.format("public.st_intersects('SRID=%s;%s', public.st_transform(shape, %s))",
                                      DEFAULT_SRID_DEGREE, transformed, DEFAULT_SRID_DEGREE)));
    }

    private Polygon[] extractPolygons(List<List<List<Object>>> dataPolygons) {
        final Polygon[] polygons = new Polygon[dataPolygons.size()];
        IntStream.range(0, dataPolygons.size())
                 .forEach(j -> {
                     LinearRing[] rings = extractRings(dataPolygons.get(j));

                     final LinearRing shell = rings[0];
                     final LinearRing[] holes = Arrays.copyOfRange(rings, 1, rings.length);
                     final Polygon polygon = geometryFactory.createPolygon(shell, holes);

                     polygons[j] = polygon;
                 });

        return polygons;
    }

    private LinearRing[] extractRings(List<List<Object>> dataRings) {
        final LinearRing[] rings = new LinearRing[dataRings.size()];
        IntStream.range(0, dataRings.size())
                 .forEach(k -> {
                     final CoordinateXY[] pointsArray = extractPoints(dataRings.get(k));
                     final LinearRing linearRing = geometryFactory.createLinearRing(pointsArray);

                     rings[k] = linearRing;
                 });

        return rings;
    }

    private CoordinateXY[] extractPoints(List<Object> ringPoints) {
        final CoordinateXY[] pointsArray = new CoordinateXY[ringPoints.size()];
        IntStream.range(0, ringPoints.size())
                 .forEach(i -> {
                     Object point = ringPoints.get(i);
                     List<Double> points = (List<Double>) point;
                     final double x = Double.parseDouble(String.valueOf(points.get(0)));
                     final double y = Double.parseDouble(String.valueOf(points.get(1)));
                     final CoordinateXY coordinateXY = new CoordinateXY(toLongitude(x), toLatitude(y));

                     pointsArray[i] = coordinateXY;
                 });

        return pointsArray;
    }

    private double toLongitude(double x) {
        return Math.toDegrees(x / WEB_MERCATOR_RADIUS);
    }

    private double toLatitude(double y) {
        return Math.toDegrees(Math.atan(Math.sinh(y / WEB_MERCATOR_RADIUS)));
    }
}
