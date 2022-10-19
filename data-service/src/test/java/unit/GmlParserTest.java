package unit;

import org.geotools.gml.GMLException;
import org.junit.Before;
import org.junit.Test;
import org.springframework.core.io.FileSystemResource;
import ru.mycrg.data_service.service.parsers.GmlParser;
import ru.mycrg.data_service.service.parsers.model.FeatureData;
import ru.mycrg.data_service.service.parsers.model.FeatureObject;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.enums.GeometryType;

import javax.xml.parsers.ParserConfigurationException;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;

public class GmlParserTest {

    private final GmlParser gmlParser = new GmlParser();
    private SchemaDto schema;

    public GmlParserTest() throws ParserConfigurationException {
        // Required
    }

    @Before
    public void prepare() {
        SimplePropertyDto globalId = new SimplePropertyDto();
        globalId.setName("GLOBALID");
        SimplePropertyDto classId = new SimplePropertyDto();
        classId.setName("CLASSID");
        SimplePropertyDto zoneDesc = new SimplePropertyDto();
        zoneDesc.setName("ZONE_DESC");
        SimplePropertyDto objectName = new SimplePropertyDto();
        objectName.setName("OBJECTNAME");
        SimplePropertyDto source = new SimplePropertyDto();
        source.setName("SOURCE");
        SimplePropertyDto status = new SimplePropertyDto();
        status.setName("STATUS");
        SimplePropertyDto shape = new SimplePropertyDto();
        shape.setName("shape");

        SchemaDto schemaDto = new SchemaDto();
        schemaDto.setName("engprotectionzone");
        schemaDto.setTitle("Охранная зона инженерных коммуникаций");
        schemaDto.setOriginName("EngProtectionZone");
        schemaDto.setProperties(Arrays.asList(globalId, status, shape, source, classId, zoneDesc));

        schema = schemaDto;
    }

    @Test
    public void shouldCorrectParsePolygonPathGeometry() throws GMLException {
        FileSystemResource file = new FileSystemResource("src/test/resources/geometryWithPolygonPatch.gml");
        schema.setGeometryType(GeometryType.MULTI_POLYGON);

        FeatureData parseAttributes = gmlParser.parseAttributes(file, schema, false, "EPSG:3857");

        assertNotNull(parseAttributes);
        assertFalse(parseAttributes.getObjects().isEmpty());
        assertEquals(schema.getOriginName(), parseAttributes.getName());
        for (FeatureObject featureObject: parseAttributes.getObjects()) {
            boolean shapeExist = featureObject.getProperties()
                                              .stream()
                                              .anyMatch(featureProperty -> featureProperty.getName().equals("shape"));
            assertTrue(shapeExist);
        }
    }

    @Test
    public void shouldCorrectParsePolygonGeometry() throws GMLException {
        FileSystemResource file = new FileSystemResource("src/test/resources/geometryWithPolygon.gml");
        schema.setGeometryType(GeometryType.MULTI_POLYGON);

        FeatureData parseAttributes = gmlParser.parseAttributes(file, schema, false, "EPSG:3857");

        assertNotNull(parseAttributes);
        assertFalse(parseAttributes.getObjects().isEmpty());
        assertEquals(schema.getOriginName(), parseAttributes.getName());
        for (FeatureObject featureObject: parseAttributes.getObjects()) {
            boolean shapeExist = featureObject.getProperties()
                                              .stream()
                                              .anyMatch(featureProperty -> featureProperty.getName().equals("shape"));
            assertTrue(shapeExist);
        }
    }

    @Test
    public void shouldCorrectParsePointGeometry() throws GMLException {
        FileSystemResource file = new FileSystemResource("src/test/resources/geometryWithPoint.gml");
        schema.setGeometryType(GeometryType.POINT);

        FeatureData parseAttributes = gmlParser.parseAttributes(file, schema, false, "EPSG:3857");

        assertNotNull(parseAttributes);
        assertFalse(parseAttributes.getObjects().isEmpty());
        assertEquals(schema.getOriginName(), parseAttributes.getName());
        for (FeatureObject featureObject: parseAttributes.getObjects()) {
            boolean shapeExist = featureObject.getProperties()
                                              .stream()
                                              .anyMatch(featureProperty -> featureProperty.getName().equals("shape"));
            assertTrue(shapeExist);
        }
    }

    @Test
    public void shouldCorrectParseLineStringGeometry() throws GMLException {
        FileSystemResource file = new FileSystemResource("src/test/resources/geometryWithLineString.gml");
        schema.setGeometryType(GeometryType.MULTI_LINE_STRING);

        FeatureData parseAttributes = gmlParser.parseAttributes(file, schema, false, "EPSG:3857");

        assertNotNull(parseAttributes);
        assertFalse(parseAttributes.getObjects().isEmpty());
        assertEquals(schema.getOriginName(), parseAttributes.getName());
        for (FeatureObject featureObject: parseAttributes.getObjects()) {
            boolean shapeExist = featureObject.getProperties()
                                              .stream()
                                              .anyMatch(featureProperty -> featureProperty.getName().equals("shape"));
            assertTrue(shapeExist);
        }
    }

    @Test
    public void shouldCorrectParseMultiCurveGeometry() throws GMLException {
        FileSystemResource file = new FileSystemResource("src/test/resources/geometryWithMultiCurve.gml");
        schema.setGeometryType(GeometryType.MULTI_LINE_STRING);

        FeatureData parseAttributes = gmlParser.parseAttributes(file, schema, false, "EPSG:3857");

        assertNotNull(parseAttributes);
        assertFalse(parseAttributes.getObjects().isEmpty());
        assertEquals(schema.getOriginName(), parseAttributes.getName());
        for (FeatureObject featureObject: parseAttributes.getObjects()) {
            boolean shapeExist = featureObject.getProperties()
                                              .stream()
                                              .anyMatch(featureProperty -> featureProperty.getName().equals("shape"));
            assertTrue(shapeExist);
        }
    }

    @Test
    public void shouldCorrectParseCurveGeometry() throws GMLException {
        FileSystemResource file = new FileSystemResource("src/test/resources/geometryWithCurve.gml");
        schema.setGeometryType(GeometryType.MULTI_LINE_STRING);

        FeatureData parseAttributes = gmlParser.parseAttributes(file, schema, false, "EPSG:3857");

        assertNotNull(parseAttributes);
        assertFalse(parseAttributes.getObjects().isEmpty());
        assertEquals(schema.getOriginName(), parseAttributes.getName());
        for (FeatureObject featureObject: parseAttributes.getObjects()) {
            boolean shapeExist = featureObject.getProperties()
                                              .stream()
                                              .anyMatch(featureProperty -> featureProperty.getName().equals("shape"));
            assertTrue(shapeExist);
        }
    }

    @Test
    public void shouldCorrectParseMultiSurfaceGeometry() throws GMLException {
        FileSystemResource file = new FileSystemResource("src/test/resources/geometryWithMultiSurface.gml");
        schema.setGeometryType(GeometryType.MULTI_POLYGON);

        FeatureData parseAttributes = gmlParser.parseAttributes(file, schema, false, "EPSG:3857");

        assertNotNull(parseAttributes);
        assertFalse(parseAttributes.getObjects().isEmpty());
        assertEquals(schema.getOriginName(), parseAttributes.getName());
        for (FeatureObject featureObject: parseAttributes.getObjects()) {
            boolean shapeExist = featureObject.getProperties()
                                              .stream()
                                              .anyMatch(featureProperty -> featureProperty.getName().equals("shape"));
            assertTrue(shapeExist);
        }
    }
}
