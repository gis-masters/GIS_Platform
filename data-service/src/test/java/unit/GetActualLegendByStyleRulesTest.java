package unit;

import org.jetbrains.annotations.NotNull;
import org.junit.Test;
import ru.mycrg.data_service.dto.styles.*;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static ru.mycrg.data_service.dao.query_builder.QueryBuilder.*;
import static ru.mycrg.data_service.dto.styles.ComparisonRuleOperator.IS_EQUAL_TO;

public class GetActualLegendByStyleRulesTest {

    @Test
    public void shouldCorrectBuildIsEqualToQuery() {
        // ARRANGE
        final String schemaName = "data";
        final String tableName = "test_table";
        final ResourceQualifier tQualifier = new ResourceQualifier(schemaName, tableName);
        final SpatialRuleFilter bboxFilter = prepareBboxFilter();
        final String propertyName = "ruleid";
        final String value = "100";

        final ComparisonRuleFilter isEqualToFilter = new ComparisonRuleFilter(IS_EQUAL_TO, propertyName, value);

        // ACT
        final String resultQuery = buildSelectQueryWithBbox(tQualifier, List.of(isEqualToFilter), bboxFilter);

        // ASSERT
        assertEquals(
                "SELECT DISTINCT " + propertyName + " FROM " + tQualifier.getQualifier() + " " +
                        "WHERE ((" + propertyName + " = '" + value + "') AND (public.st_intersects('SRID=4326;" +
                        "MULTIPOLYGON (((33.28094828570004 44.92255682261622, 37.06168842777256 44.92255682261622, " +
                        "37.06168842777256 45.54747161613013, 33.28094828570004 45.54747161613013, " +
                        "33.28094828570004 44.92255682261622)))', public.st_transform(shape, 4326))))",
                resultQuery);
    }

    @Test
    public void shouldCorrectBuildSelectOneQuery() {
        // ARRANGE
        final String schemaName = "data";
        final String tableName = "test_table";
        final ResourceQualifier tQualifier = new ResourceQualifier(schemaName, tableName);
        final SpatialRuleFilter bboxFilter = prepareBboxFilter();

        // ACT
        final String resultQuery = buildSelectOneQueryWithBbox(tQualifier, bboxFilter);

        // ASSERT
        assertEquals(
                "SELECT * FROM " + tQualifier.getQualifier() +
                        " WHERE (public.st_intersects('SRID=4326;MULTIPOLYGON (((33.28094828570004 44.92255682261622, " +
                        "37.06168842777256 44.92255682261622, 37.06168842777256 45.54747161613013, " +
                        "33.28094828570004 45.54747161613013, 33.28094828570004 44.92255682261622)))', " +
                        "public.st_transform(shape, 4326))) LIMIT 1",
                resultQuery);
    }

    @NotNull
    private SpatialRuleFilter prepareBboxFilter() {
        final List<Object> polygons = new ArrayList<>();
        polygons.add(Arrays.asList("3704818.216281399", "5609337.871252162"));
        polygons.add(Arrays.asList("4125688.283718601", "5609337.871252162"));
        polygons.add(Arrays.asList("4125688.283718601", "5708125.428747838"));
        polygons.add(Arrays.asList("3704818.216281399", "5708125.428747838"));
        polygons.add(Arrays.asList("3704818.216281399", "5609337.871252162"));

        final List<List<Object>> rings = new ArrayList<>();
        rings.add(polygons);

        final List<List<List<Object>>> multiPolygons = new ArrayList<>();
        multiPolygons.add(rings);

        final SpatialLiteral literal = new SpatialLiteral();
        literal.setType(SpatialLiteralType.MULTIPOLYGON);
        literal.setCoordinates(multiPolygons);

        final SpatialRuleFilter bboxFilter = new SpatialRuleFilter();
        bboxFilter.setOperator(SpacialRuleOperator.INTERSECTS);
        bboxFilter.setPropertyName("shape");
        bboxFilter.setLiteral(literal);

        return bboxFilter;
    }
}
