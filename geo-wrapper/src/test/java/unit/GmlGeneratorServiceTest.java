package unit;

import org.geotools.geometry.jts.WKTReader2;
import org.junit.Test;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.Polygon;
import org.locationtech.jts.io.ParseException;
import org.mockito.Mock;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mock.env.MockEnvironment;
import ru.mycrg.common.EntityTypeDto;
import ru.mycrg.common.MqExportProcessRequest;
import ru.mycrg.common.ResourceProjection;
import ru.mycrg.common.SimplePropertyDto;
import ru.mycrg.wrapper.dao.DatasourceFactory;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.TransformerException;
import java.util.ArrayList;
import java.util.List;

import static junit.framework.TestCase.assertNotNull;

public class GmlGeneratorServiceTest {

    @Mock
    JdbcTemplate jdbcTemplate;

    @Test
    public void shouldGenerateGml() throws ParserConfigurationException, TransformerException {
        MockEnvironment env = new MockEnvironment();
        env.setProperty("spring.datasource.url", "jdbc:postgresql://127.0.0.1:5434/postgres");
        env.setProperty("spring.datasource.username", "fiz");
        env.setProperty("spring.datasource.password", "314");

        DatasourceFactory datasourceFactory = new DatasourceFactory(env, jdbcTemplate);

        MqExportProcessRequest gmlMqRequest = new MqExportProcessRequest();
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
        SimplePropertyDto shape = new SimplePropertyDto();
        shape.setName("SHAPE");

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
        electriclineProperties.add(shape);

        electricline.setProperties(electriclineProperties);

        // ----------------------------
        fgistpRules.add(functionalZone);
        fgistpRules.add(electricline);
        gmlMqRequest.setFgistpRules(fgistpRules);

//        GmlGenerator gmlGenerator = new GmlGenerator(
//                new GisStorage(datasourceFactory),
//                new FileService(new FizProperties()),
//                new ValidatorImpl());
//
//        // ACT
//        GmlDocumentHolder gml = gmlGenerator.createDomDocuments(gmlMqRequest);
//        Map<String, String> paths = gmlGenerator.generate(gmlMqRequest);
//        assertTrue(paths.get("gml").length() > 0);
//
//        assertNotNull(gml.getGmlDocument());
//        assertTrue(gml.getGmlDocument().getElementsByTagName("FunctionalZone").getLength() > 0);
    }

    @Test
    public void shouldTest2() throws ParseException {
        String electricline = "MULTILINESTRING((6592387.9853 4930796.0613,6592381.3446 4930622.6243,6592104.0698 " +
                "4930418.8608,6592010.5395 4930499.868,6591938.9934 4930399.6067,6591840.2578 4930357.5477," +
                "6591771.6732 4930321.48,6591656.4473 4930317.9192,6591307.3624 4930393.5754,6591073.9903 " +
                "4930210.9063,6590839.0425 4930246.1438,6590811.3496 4930249.8546,6590808.2314 4930250.2847," +
                "6590730.4077 4930261.137,6590722.3316 4930343.3346,6590714.2473 4930425.5322,6590706.3445 " +
                "4930507.3196,6590710.4692 4930602.5,6590706.7817 4930663.383))";

        String functionalzone = "MULTIPOLYGON(((6574494.1376 4919028.2325,6574475.1082 4919055.2051,6574474.9462 " +
                "4919055.3776,6574511.131 4919080.4745,6574526.49 4919091.1263,6574531.8861 4919090.7536,6574534.3365" +
                " 4919089.0816,6574525.0959 4919056.5317,6574523.2885 4919054.9356,6574494.1376 4919028.2325)))";

        String electrictransformer = "POINT(6574347.9971 4918823.9425)";

        WKTReader2 wkt = new WKTReader2();
        Geometry elGeometry = wkt.read(electricline);
        Geometry etGeometry = wkt.read(electrictransformer);
        Geometry fzGeometry = wkt.read(functionalzone);

        ((Polygon) fzGeometry.getGeometryN(0)).getExteriorRing().getCoordinates();
        assertNotNull(fzGeometry);
    }

}
