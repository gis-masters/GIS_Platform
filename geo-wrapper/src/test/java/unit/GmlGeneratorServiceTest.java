package unit;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mock.env.MockEnvironment;
import ru.mycrg.common.ResourceProjection;
import ru.mycrg.wrapper.dao.DatasourceFactory;
import ru.mycrg.wrapper.dao.GisStorage;
import ru.mycrg.wrapper.service.GmlGenerator;

import java.io.IOException;

import static junit.framework.TestCase.assertTrue;

public class GmlGeneratorServiceTest {

    @Mock
    JdbcTemplate jdbcTemplate;

    @Before
    public void setupMock() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void shouldGenerateGml() throws IOException {
        MockEnvironment env = new MockEnvironment();
        env.setProperty("spring.datasource.url", "jdbc:postgresql://127.0.0.1:5434/postgres");
        env.setProperty("spring.datasource.username", "fiz");
        env.setProperty("spring.datasource.password", "314");

        DatasourceFactory datasourceFactory = new DatasourceFactory(env, jdbcTemplate);

        GmlGenerator gmlGenerator = new GmlGenerator(new GisStorage(datasourceFactory));
        gmlGenerator.generate(new ResourceProjection("gis", "fiz", "electricline"));

        assertTrue(true);
    }

}
