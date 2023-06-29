package unit;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static ru.mycrg.data_service.util.StringUtil.camelCaseToSnakeCase;
import static ru.mycrg.data_service.util.StringUtil.camelCaseToSnakeCaseForEcqlFilter;

public class StringUtilTest {

    @Test
    public void shouldConvertStringFromCamelCaseToSnakeCase() {
        assertEquals("Camel", camelCaseToSnakeCase("Camel"));
        assertEquals("JSON", camelCaseToSnakeCase("JSON"));
        assertEquals("camel_case", camelCaseToSnakeCase("camelCase"));
        assertEquals("the_best_test_i_have_seen", camelCaseToSnakeCase("theBestTestIHaveSeen"));

        assertEquals("TWO word", camelCaseToSnakeCase("TWO word"));
        assertEquals("thisisoneword", camelCaseToSnakeCase("thisisoneword"));

        assertEquals("(assigned_at in (1, 2, 3))", camelCaseToSnakeCase("(assignedAt IN (1, 2, 3))"));
    }

    @Test
    public void shouldConvertEcqlFilterCorrectly() {
        assertEquals(
                "((status = 'CREATED') AND assigned_to IN (16, 15, 14))",
                camelCaseToSnakeCaseForEcqlFilter("((status = 'CREATED') AND assignedTo IN (16, 15, 14))"));
    }
}
