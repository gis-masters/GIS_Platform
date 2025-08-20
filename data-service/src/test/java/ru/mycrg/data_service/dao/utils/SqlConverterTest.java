package ru.mycrg.data_service.dao.utils;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;
import static ru.mycrg.data_service.dao.utils.EcqlHandler.buildWhereSection;
import static ru.mycrg.data_service.dao.utils.EcqlHandler.markSingleQuotesIn;

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

    @Test
    public void shouldCastStringAsString() {
        assertEquals("WHERE (fiz = '1')", buildWhereSection("\"fiz\" IN('1')"));
        assertEquals("WHERE fiz IN ('1', '22', '333')", buildWhereSection("\"fiz\" IN ('1', '22', '333')"));
        assertEquals("WHERE ((((((is_folder = false) OR is_folder IS NULL ) " +
                             "AND (path LIKE '/root/%'  OR path = '/root')) " +
                             "AND (receipt_type = '2')) " +
                             "AND fiz_type IN ('200', '314', '5000')) " +
                             "AND is_deleted = 'false')",
                     buildWhereSection("(((is_folder IN(false) OR (is_folder IS null)))) " +
                                               "AND (((path LIKE '/root/%')) OR ((path = '/root'))) " +
                                               "AND ((receipt_type IN('2'))) " +
                                               "AND ((fiz_type IN('200', '314', '5000'))) " +
                                               "AND is_deleted = 'false'"));
    }

    @Test
    public void shouldCorrectlyMarkSingleQuotes() {
        assertEquals("some IN('marker1')", markSingleQuotesIn("some IN('1')", "marker"));
        assertEquals("some IN ('_fiz_1', '_fiz_2')", markSingleQuotesIn("some IN ('1', '2')", "_fiz_"));
        assertEquals("some1 IN ('__1', '__2') OR some2 IN ('__333','__5','__314314')",
                     markSingleQuotesIn("some1 IN ('1', '2') OR some2 IN ('333','5','314314')", "__"));
        assertEquals("((ttt IN('fiz1')))", markSingleQuotesIn("((ttt IN('1')))", "fiz"));
    }

    @Test
    public void shouldNotThrowIndexOutOfBoundsForCyrillicCharacters() {
        String input = "description LIKE ILIKE '%феод%'";
        String result = markSingleQuotesIn(input, "_маркер_");
        assertNotEquals("Метод не должен возвращать исключения",
                        System.identityHashCode(input),
                        System.identityHashCode(result));

        assertEquals(input, result);
    }
}
