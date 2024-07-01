package ru.mycrg.data_service.dao.utils;

import org.jetbrains.annotations.NotNull;
import org.junit.Test;
import ru.mycrg.data_service.dto.styles.*;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static ru.mycrg.data_service.config.CrgCommonConfig.DEFAULT_SRID_DEGREE;
import static ru.mycrg.data_service.dao.config.DaoProperties.DEFAULT_GEOMETRY_COLUMN_NAME;
import static ru.mycrg.data_service.dao.config.DaoProperties.RULE_ID;
import static ru.mycrg.data_service.dao.utils.query_builder.QueryBuilder.buildSelectOneQueryWithBbox;
import static ru.mycrg.data_service.dao.utils.query_builder.QueryBuilder.buildSelectQueryWithBbox;
import static ru.mycrg.data_service.dto.styles.ComparisonRuleOperator.IS_EQUAL_TO;

public class GetActualLegendByStyleRulesTest {

    @Test
    public void shouldCorrectBuildIsEqualToQuery() {
        // ARRANGE
        String schemaName = "data";
        String tableName = "test_table";
        ResourceQualifier tQualifier = new ResourceQualifier(schemaName, tableName);
        SpatialRuleFilter bboxFilter = prepareBboxFilter();
        String propertyName = RULE_ID;
        String value = "100";

        ComparisonRuleFilter isEqualToFilter = new ComparisonRuleFilter(IS_EQUAL_TO, propertyName, value);

        // ACT
        String resultQuery = buildSelectQueryWithBbox(tQualifier, List.of(isEqualToFilter), bboxFilter, null);

        // ASSERT
        assertEquals(
                "SELECT DISTINCT " + propertyName + " FROM " + tQualifier.getQualifier() + " " +
                        "WHERE ((" + propertyName + " = '" + value + "') AND (public.st_intersects('SRID=" + DEFAULT_SRID_DEGREE + ";" +
                        "MULTIPOLYGON (((33.28094828570004 44.92255682261622, 37.06168842777256 44.92255682261622, " +
                        "37.06168842777256 45.54747161613013, 33.28094828570004 45.54747161613013, " +
                        "33.28094828570004 44.92255682261622)))', public.st_transform(shape, " + DEFAULT_SRID_DEGREE + "))))",
                resultQuery);
    }

    @Test
    public void shouldCorrectBuildSelectOneQuery() {
        // ARRANGE
        String schemaName = "data";
        String tableName = "test_table";
        ResourceQualifier tQualifier = new ResourceQualifier(schemaName, tableName);
        SpatialRuleFilter bboxFilter = prepareBboxFilter();

        // ACT
        String resultQuery = buildSelectOneQueryWithBbox(tQualifier, bboxFilter, null);

        // ASSERT
        assertEquals(
                "SELECT * FROM " + tQualifier.getQualifier() +
                        " WHERE (public.st_intersects('SRID=" + DEFAULT_SRID_DEGREE + ";MULTIPOLYGON (((33.28094828570004 44.92255682261622, " +
                        "37.06168842777256 44.92255682261622, 37.06168842777256 45.54747161613013, " +
                        "33.28094828570004 45.54747161613013, 33.28094828570004 44.92255682261622)))', " +
                        "public.st_transform(shape, " + DEFAULT_SRID_DEGREE + "))) LIMIT 1",
                resultQuery);
    }

    @NotNull
    private SpatialRuleFilter prepareBboxFilter() {
        List<Object> polygons = new ArrayList<>();
        polygons.add(Arrays.asList("3704818.216281399", "5609337.871252162"));
        polygons.add(Arrays.asList("4125688.283718601", "5609337.871252162"));
        polygons.add(Arrays.asList("4125688.283718601", "5708125.428747838"));
        polygons.add(Arrays.asList("3704818.216281399", "5708125.428747838"));
        polygons.add(Arrays.asList("3704818.216281399", "5609337.871252162"));

        List<List<Object>> rings = new ArrayList<>();
        rings.add(polygons);

        List<List<List<Object>>> multiPolygons = new ArrayList<>();
        multiPolygons.add(rings);

        SpatialLiteral literal = new SpatialLiteral();
        literal.setType(SpatialLiteralType.MULTIPOLYGON);
        literal.setCoordinates(multiPolygons);

        SpatialRuleFilter bboxFilter = new SpatialRuleFilter();
        bboxFilter.setOperator(SpacialRuleOperator.INTERSECTS);
        bboxFilter.setPropertyName(DEFAULT_GEOMETRY_COLUMN_NAME);
        bboxFilter.setLiteral(literal);

        return bboxFilter;
    }
}
