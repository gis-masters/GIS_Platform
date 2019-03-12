package unit;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mock.env.MockEnvironment;
import ru.mycrg.common.EntityTypeDto;
import ru.mycrg.common.GmlMqRequest;
import ru.mycrg.common.ResourceProjection;
import ru.mycrg.common.SimplePropertyDto;
import ru.mycrg.common.propertyTypes.AbstractProperty;
import ru.mycrg.common.propertyTypes.StringProperty;
import ru.mycrg.wrapper.dao.DatasourceFactory;
import ru.mycrg.wrapper.dao.GisStorage;
import ru.mycrg.wrapper.service.gml.GmlDocumentHolder;
import ru.mycrg.wrapper.service.gml.GmlGenerator;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.TransformerException;

import java.util.ArrayList;
import java.util.List;

import static junit.framework.TestCase.*;

public class GmlGeneratorServiceTest {

    @Mock
    JdbcTemplate jdbcTemplate;

    @Before
    public void setupMock() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void shouldGenerateGml() throws ParserConfigurationException, TransformerException {
        MockEnvironment env = new MockEnvironment();
        env.setProperty("spring.datasource.url", "jdbc:postgresql://127.0.0.1:5434/postgres");
        env.setProperty("spring.datasource.username", "fiz");
        env.setProperty("spring.datasource.password", "314");

        DatasourceFactory datasourceFactory = new DatasourceFactory(env, jdbcTemplate);

        GmlMqRequest gmlMqRequest = new GmlMqRequest();
        gmlMqRequest.addResource(new ResourceProjection("gis", "fiz", "functionalzone"));
        gmlMqRequest.addResource(new ResourceProjection("gis", "fiz", "electricline"));

        List<EntityTypeDto> fgistpRules = new ArrayList<>();
        // FZ
        EntityTypeDto functionalZone = new EntityTypeDto();
        functionalZone.setName("FunctionalZone_Type");

        List<SimplePropertyDto> functionalZoneProperties = new ArrayList<>();
        SimplePropertyDto globalID = new SimplePropertyDto();
        globalID.setName("GLOBALID");
        SimplePropertyDto fzNotExistProp = new SimplePropertyDto();
        fzNotExistProp.setName("fzNotExistProp");
        SimplePropertyDto classId = new SimplePropertyDto();
        classId.setName("CLASSID");

        functionalZoneProperties.add(globalID);
        functionalZoneProperties.add(fzNotExistProp);
        functionalZoneProperties.add(classId);

        functionalZone.setProperties(functionalZoneProperties);

        // Electricline
        EntityTypeDto electricline = new EntityTypeDto();
        electricline.setName("ElectricLine_Type");

        List<SimplePropertyDto> electriclineProperties = new ArrayList<>();
        electriclineProperties.add(globalID);
        electriclineProperties.add(classId);

        electricline.setProperties(electriclineProperties);

        // ----------------------------
        fgistpRules.add(functionalZone);
        fgistpRules.add(electricline);
        gmlMqRequest.setFgistpRules(fgistpRules);

        GmlGenerator gmlGenerator = new GmlGenerator(new GisStorage(datasourceFactory));

        // ACTION
        GmlDocumentHolder gml = gmlGenerator.createGml(gmlMqRequest);
        String filePath = gmlGenerator.generate(gmlMqRequest);
        assertTrue(filePath.length() > 0);

        assertNotNull(gml.getDocument());
        assertTrue(gml.getDocument().getElementsByTagName("FunctionalZone").getLength() > 0);
    }

//    @Test
//    public void generateData() {
//        MockEnvironment env = new MockEnvironment();
//        env.setProperty("spring.datasource.url", "jdbc:postgresql://127.0.0.1:5434/postgres");
//        env.setProperty("spring.datasource.username", "fiz");
//        env.setProperty("spring.datasource.password", "314");
//
//        DatasourceFactory datasourceFactory = new DatasourceFactory(env, jdbcTemplate);
//
//        List<Map<String, Object>> batch = new ArrayList<>();
//
//        for (int i = 0; i < 10; i++) {
//            Map<String, Object> params = new HashMap<>();
//            params.put("classid", "314314");
//            params.put("other", "other string");
//            params.put("globalid", UUID.randomUUID());
//
//            batch.add(params);
//        }
//
//        GisStorage gisStorage = new GisStorage(datasourceFactory);
//        gisStorage.saveBatch(jdbcTemplate, new ResourceProjection("gis", "fiz", "functionalzone"), batch);
//
//        assertTrue(true);
//    }

}
