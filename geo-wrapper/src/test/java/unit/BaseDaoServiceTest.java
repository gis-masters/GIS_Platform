package unit;

import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.core.env.Environment;
import org.springframework.core.io.ResourceLoader;
import org.springframework.jdbc.core.JdbcTemplate;
import ru.mycrg.common.ValidationMqProcessRequest;
import ru.mycrg.wrapper.dao.DatasourceFactory;
import ru.mycrg.wrapper.dao.BaseDaoService;

import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.when;

public class BaseDaoServiceTest {

    @Mock
    Environment environment;

    @Mock
    JdbcTemplate jdbcTemplate;

    @Mock
    ResourceLoader resourceLoader;

    @Before
    public void setupMock() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    @Ignore
    public void shouldConvertToJSON() {
        BaseDaoService baseDaoService = new BaseDaoService(new DatasourceFactory(environment, jdbcTemplate), resourceLoader);

        ValidationMqProcessRequest mqRequest = new ValidationMqProcessRequest();

        when(environment.getProperty("spring.datasource.url")).thenReturn("jdbc:postgresql://127.0.0.1:5434/postgres");

        long aLong = mqRequest.getResourceProjections().stream()
                .mapToLong(baseDaoService::countTotalRows)
                .sum();

        assertTrue(aLong > 0);
    }

}
