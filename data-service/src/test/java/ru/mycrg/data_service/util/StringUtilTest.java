package ru.mycrg.data_service.util;

import org.junit.Test;

import java.util.Map;

import static org.junit.Assert.assertEquals;
import static ru.mycrg.data_service.util.StringUtil.*;

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

    @Test
    public void shouldBuildQueryWithParamsCorrectly() {
        String expected = "SELECT * FROM test WHERE status = 'CREATED' AND fiz = 'fiz' AND assigned_to = 'fiz@fiz'";
        String actual = buildQueryWithParams(
                "SELECT * FROM test WHERE status = :status AND fiz = :fiz AND assigned_to = :assignedTo",
                Map.of("status", "CREATED",
                       "fiz", "fiz",
                       "assignedTo", "fiz@fiz"));

        assertEquals(expected, actual);
    }
}
