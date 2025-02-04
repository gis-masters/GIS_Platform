package ru.mycrg.data_service.dao.utils.query_builder.rule_handlers;

import com.healthmarketscience.sqlbuilder.Condition;
import com.healthmarketscience.sqlbuilder.CustomCondition;
import com.healthmarketscience.sqlbuilder.CustomSql;
import org.geotools.geometry.jts.JTS;
import org.geotools.referencing.CRS;
import org.locationtech.jts.geom.*;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.operation.MathTransform;
import org.opengis.referencing.operation.TransformException;
import ru.mycrg.data_service.dto.styles.RuleFilter;
import ru.mycrg.data_service.dto.styles.SpatialLiteral;
import ru.mycrg.data_service.dto.styles.SpatialRuleFilter;

import java.util.Arrays;
import java.util.List;
import java.util.stream.IntStream;

import static org.geotools.referencing.crs.DefaultGeographicCRS.WGS84;
import static ru.mycrg.data_service.config.CrgCommonConfig.DEFAULT_EPSG_METRE;
import static ru.mycrg.data_service.config.CrgCommonConfig.DEFAULT_SRID_DEGREE;
import static ru.mycrg.data_service.dto.styles.SpatialLiteralType.MULTIPOLYGON;

public class SpatialRuleMapper implements RuleMapper {

    private final MathTransform mathTransform;
    private final GeometryFactory geometryFactory;

    public SpatialRuleMapper() throws FactoryException {
        this.geometryFactory = new GeometryFactory();
        this.mathTransform = CRS.findMathTransform(CRS.decode(DEFAULT_EPSG_METRE), WGS84);
    }

    @Override
    public Condition map(RuleFilter ruleFilter) throws FactoryException, TransformException {
        final SpatialRuleFilter filter = (SpatialRuleFilter) ruleFilter;
        final SpatialLiteral spatialLiteral = filter.getLiteral();

        if (!spatialLiteral.getType().equals(MULTIPOLYGON)) {
            throw new TransformException("Support only MULTIPOLYGON yet");
        }

        final Polygon[] polygons = extractPolygons(spatialLiteral.getCoordinates());
        final MultiPolygon multiPolygon = geometryFactory.createMultiPolygon(polygons);

        final Geometry transformed = JTS.transform(multiPolygon, mathTransform);
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
                     final CoordinateXY coordinateXY = new CoordinateXY(
                             Double.parseDouble(String.valueOf(points.get(0))),
                             Double.parseDouble(String.valueOf(points.get(1))));

                     pointsArray[i] = coordinateXY;
                 });

        return pointsArray;
    }
}
