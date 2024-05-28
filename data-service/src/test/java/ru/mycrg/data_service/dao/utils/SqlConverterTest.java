package ru.mycrg.data_service.dao.utils;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static ru.mycrg.data_service.dao.utils.EcqlHandler.buildWhereSection;

public class SqlConverterTest {

    @Test
    public void nullableEcqlFilterConvertsToEmptyString() {
        assertEquals("", buildWhereSection(null));
    }

    @Test
    public void emptyEcqlFilterConvertsToEmptyString() {
        assertEquals("", buildWhereSection("   "));
    }

    @Test
    public void shouldCorrectConvertComparisonCases() {
        assertEquals("WHERE persons > 150", buildWhereSection("persons > 150"));
        assertEquals("WHERE STATE_NAME = 'California'", buildWhereSection("STATE_NAME = 'California'"));
        assertEquals("WHERE STATE_NAME LIKE 'n%' ", buildWhereSection("STATE_NAME LIKE 'n%'"));
        assertEquals("WHERE  UPPER(STATE_NAME) LIKE 'N%' ", buildWhereSection("STATE_NAME ILIKE 'n%'"));
        assertEquals("WHERE UNEMPLOY / (EMPLOYED + UNEMPLOY) > 0.07",
                     buildWhereSection("UNEMPLOY / (EMPLOYED + UNEMPLOY) > 0.07"));
        assertEquals("WHERE STATE_NAME IN ('New York', 'California', 'Montana', 'Texas')",
                     buildWhereSection("STATE_NAME IN ('New York', 'California', 'Montana', 'Texas')"));
    }

    @Test
    public void shouldCorrectConvertGeometricFilters() {
        assertEquals(
                "WHERE shape && ST_GeomFromText('POLYGON ((-90 40, -90 45, -60 45, -60 40, -90 40))', null) AND ST_Intersects(shape, ST_GeomFromText('POLYGON ((-90 40, -90 45, -60 45, -60 40, -90 40))', null))",
                buildWhereSection("BBOX(shape, -90, 40, -60, 45)"));
        assertEquals(
                "WHERE NOT (ST_Intersects(the_geom, ST_GeomFromText('POLYGON ((-90 40, -90 45, -60 45, -60 40, -90 40))', null)))",
                buildWhereSection("DISJOINT(the_geom, POLYGON((-90 40, -90 45, -60 45, -60 40, -90 40)))"));
    }

    /**
     * As workaround for numbers and 'id' also.
     */
    @Test
    public void shouldAddQuotesAndConvertToTextForNumberColumns() {
        assertEquals("WHERE  UPPER(size::text) LIKE '1' ", buildWhereSection("\"size::text\" ILIKE '1'"));
        assertEquals("WHERE  UPPER(id::text) LIKE '1' ", buildWhereSection("\"id::text\" ILIKE '1'"));
    }

    /**
     * As workaround for primary keys.
     */
    @Test
    public void shouldAlwaysAddQuotes() {
        assertEquals("WHERE size IN (1, 13)", buildWhereSection("\"size\" IN (1, 13)"));
        assertEquals("WHERE size = 13", buildWhereSection("\"size\" = 13"));
        assertEquals("WHERE id IN (1, 13)", buildWhereSection("\"id\" IN (1, 13)"));
        assertEquals("WHERE id = 13", buildWhereSection("\"id\" = 13"));
        assertEquals("WHERE id > 13", buildWhereSection("\"id\" > 13"));
    }
}
