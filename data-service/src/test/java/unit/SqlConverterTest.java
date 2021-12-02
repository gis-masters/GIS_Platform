package unit;

import org.geotools.data.jdbc.FilterToSQLException;
import org.geotools.filter.text.cql2.CQLException;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static ru.mycrg.data_service.dao.utils.SqlBuilder.buildWhereSection;

public class SqlConverterTest {

    @Test
    public void nullableEcqlFilterConvertsToEmptyString() throws FilterToSQLException, CQLException {
        assertEquals("", buildWhereSection(null));
    }

    @Test
    public void emptyEcqlFilterConvertsToEmptyString() throws FilterToSQLException, CQLException {
        assertEquals("", buildWhereSection("   "));
    }

    @Test
    public void shouldCorrectConvertComparisonCases() throws FilterToSQLException, CQLException {
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
    public void shouldCorrectConvertGeometricFilters() throws FilterToSQLException, CQLException {
        assertEquals(
                "WHERE shape && ST_GeomFromText('POLYGON ((-90 40, -90 45, -60 45, -60 40, -90 40))', null) AND ST_Intersects(shape, ST_GeomFromText('POLYGON ((-90 40, -90 45, -60 45, -60 40, -90 40))', null))",
                buildWhereSection("BBOX(shape, -90, 40, -60, 45)"));
        assertEquals(
                "WHERE NOT (ST_Intersects(the_geom, ST_GeomFromText('POLYGON ((-90 40, -90 45, -60 45, -60 40, -90 40))', null)))",
                buildWhereSection("DISJOINT(the_geom, POLYGON((-90 40, -90 45, -60 45, -60 40, -90 40)))"));
    }
}
