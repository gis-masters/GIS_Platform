package unit._import;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.BeforeClass;
import org.junit.Test;
import ru.mycrg.common.FeatureDescriptionDto;
import ru.mycrg.common.ResourceProjection;
import ru.mycrg.common.SimplePropertyDto;
import ru.mycrg.common.enums.ValueType;
import ru.mycrg.common.import_.ImportMqTask;
import ru.mycrg.common.import_.MatchingPair;
import ru.mycrg.wrapper.dao.SqlGenerator;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;

public class SqlGeneratorTest {

    private ObjectMapper mapper = new ObjectMapper();

    private static ImportMqTask importModel;

    @BeforeClass
    public static void beforeEach() {
        importModel = new ImportMqTask();
        importModel.setSrs(28406);
        importModel.setSourceResource(new ResourceProjection("SDB", "sSchema", "sTable"));
        importModel.setTargetResource(new ResourceProjection("TDB", "tSchema", "tTable"));
    }

    @Test(expected = AssertionError.class)
    public void shouldThrowAssertionError() {
        SqlGenerator.prepareCreateTableRequest(new ImportMqTask());
    }

    @Test
    public void shouldGenerateTableWithObjectIdOnly() {
        importModel.setFeatureDescription(new FeatureDescriptionDto());
        importModel.setPairs(new ArrayList<>());

        // ACT
        String resultSql = SqlGenerator.prepareCreateTableRequest(importModel);

        assertEquals("CREATE TABLE tSchema.tTable (objectid integer NOT NULL); " +
                "ALTER TABLE ONLY tSchema.tTable ADD CONSTRAINT tTable_pkey PRIMARY KEY (objectid);", resultSql);
    }

    @Test
    public void shouldGenerateSqlRequest_withoutGeometry() throws IOException {
        SimplePropertyDto stringPropertySchema = new SimplePropertyDto();
        stringPropertySchema.setValueType(ValueType.STRING);
        stringPropertySchema.setName("NUMBER");

        SimplePropertyDto classIdPropertySchema = new SimplePropertyDto();
        classIdPropertySchema.setValueType(ValueType.INT);
        classIdPropertySchema.setName("classid");

        FeatureDescriptionDto featureDescription = new FeatureDescriptionDto();
        featureDescription.addProperty(classIdPropertySchema);
        featureDescription.addProperty(stringPropertySchema);

        importModel.setFeatureDescription(featureDescription);
        importModel.setPairs(getSimpleMatchingPairs(MatchingSamples.commonCase));

        // ACT
        String resultSql = SqlGenerator.prepareCreateTableRequest(importModel);

        assertEquals("CREATE TABLE tSchema.tTable (" +
                        "objectid integer NOT NULL, " +
                        "classid integer, " +
                        "NUMBER character varying(255), " +
                        "feature_le integer, " +
                        "feature__1 varchar); " +
                     "ALTER TABLE ONLY tSchema.tTable ADD CONSTRAINT tTable_pkey PRIMARY KEY (objectid);",
                resultSql);
    }

    @Test
    public void shouldGenerateSqlRequest_withGeometry() throws IOException {
        SimplePropertyDto szzSizePropertySchema = new SimplePropertyDto();
        szzSizePropertySchema.setValueType(ValueType.DOUBLE);
        szzSizePropertySchema.setName("szz_size");

        SimplePropertyDto statusPropertySchema = new SimplePropertyDto();
        statusPropertySchema.setValueType(ValueType.INT);
        statusPropertySchema.setName("status");

        SimplePropertyDto geometryPropertySchema = new SimplePropertyDto();
        geometryPropertySchema.setValueType(ValueType.GEOMETRY);
        geometryPropertySchema.setName("shape");

        FeatureDescriptionDto featureDescription = new FeatureDescriptionDto();
        featureDescription.addProperty(szzSizePropertySchema);
        featureDescription.addProperty(statusPropertySchema);
        featureDescription.addProperty(geometryPropertySchema);

        importModel.setFeatureDescription(featureDescription);
        importModel.setPairs(getSimpleMatchingPairs(MatchingSamples.commonCase));

        // ACT
        String resultSql = SqlGenerator.prepareCreateTableRequest(importModel);

        assertEquals("CREATE TABLE tSchema.tTable (" +
                        "objectid integer NOT NULL, " +
                        "szz_size numeric(38,8), " +
                        "status integer, " +
                        "shape public.geometry, " +
                        "feature_le integer, " +
                        "feature__1 varchar); " +
                    "ALTER TABLE ONLY tSchema.tTable ADD CONSTRAINT tTable_pkey PRIMARY KEY (objectid); " +
                    "ALTER TABLE ONLY tSchema.tTable " +
                        "ADD CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406));",
                resultSql);
    }

    @Test
    public void shouldGenerateBySchema_WithoutMatchingPairs() {
        SimplePropertyDto szzSizePropertySchema = new SimplePropertyDto();
        szzSizePropertySchema.setValueType(ValueType.DOUBLE);
        szzSizePropertySchema.setName("SZZ_SIZE");

        SimplePropertyDto statusPropertySchema = new SimplePropertyDto();
        statusPropertySchema.setValueType(ValueType.INT);
        statusPropertySchema.setName("status");

        SimplePropertyDto geometryPropertySchema = new SimplePropertyDto();
        geometryPropertySchema.setValueType(ValueType.GEOMETRY);
        geometryPropertySchema.setName("shape");

        FeatureDescriptionDto featureDescription = new FeatureDescriptionDto();
        featureDescription.addProperty(szzSizePropertySchema);
        featureDescription.addProperty(statusPropertySchema);
        featureDescription.addProperty(geometryPropertySchema);

        importModel.setFeatureDescription(featureDescription);
        importModel.setPairs(new ArrayList<>());

        // ACT
        String resultSql = SqlGenerator.prepareCreateTableRequest(importModel);

        assertEquals("CREATE TABLE tSchema.tTable (" +
                        "objectid integer NOT NULL, " +
                        "SZZ_SIZE numeric(38,8), " +
                        "status integer, " +
                        "shape public.geometry); " +
                    "ALTER TABLE ONLY tSchema.tTable ADD CONSTRAINT tTable_pkey PRIMARY KEY (objectid); " +
                    "ALTER TABLE ONLY tSchema.tTable " +
                        "ADD CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406));",
                resultSql);
    }

    @Test
    public void shouldGenerateTableAsIs() {
        importModel.setFeatureDescription(new FeatureDescriptionDto());
        importModel.setPairs(getSimpleMatchingPairs(MatchingSamples.asIs));

        // ACT
        String resultSql = SqlGenerator.prepareCreateTableRequest(importModel);

        assertEquals("CREATE TABLE tSchema.tTable (" +
                        "objectid integer NOT NULL, " +
                        "classid integer, " +
                        "number varchar, " +
                        "feature_le integer, " +
                        "status integer); " +
                        "ALTER TABLE ONLY tSchema.tTable ADD CONSTRAINT tTable_pkey PRIMARY KEY (objectid);",
                resultSql);
    }

    @Test
    public void shouldCorrectHandleIncorrectMapping() {
        SimplePropertyDto szzSizePropertySchema = new SimplePropertyDto();
        szzSizePropertySchema.setValueType(ValueType.DOUBLE);
        szzSizePropertySchema.setName("SZZ_SIZE");

        SimplePropertyDto statusPropertySchema = new SimplePropertyDto();
        statusPropertySchema.setValueType(ValueType.INT);
        statusPropertySchema.setName("status");

        FeatureDescriptionDto featureDescription = new FeatureDescriptionDto();
        featureDescription.addProperty(szzSizePropertySchema);
        featureDescription.addProperty(statusPropertySchema);

        importModel.setFeatureDescription(featureDescription);
        importModel.setPairs(getSimpleMatchingPairs(MatchingSamples.collisionWithSchemaAttributes));

        // ACT
        String resultSql = SqlGenerator.prepareCreateTableRequest(importModel);

        assertEquals("CREATE TABLE tSchema.tTable (" +
                        "objectid integer NOT NULL, " +
                        "SZZ_SIZE numeric(38,8), " +
                        "status integer); " +
                        "ALTER TABLE ONLY tSchema.tTable ADD CONSTRAINT tTable_pkey PRIMARY KEY (objectid);",
                resultSql);
    }

    @Test
    public void shouldConvertTheGeomToShape() {
        importModel.setFeatureDescription(new FeatureDescriptionDto());
        importModel.setPairs(getSimpleMatchingPairs(MatchingSamples.the_geom));

        // ACT
        String resultSql = SqlGenerator.prepareCreateTableRequest(importModel);

        assertEquals("CREATE TABLE tSchema.tTable (" +
                        "objectid integer NOT NULL, " +
                        "shape public.geometry, " +
                        "POPULATION varchar, " +
                        "GlobalID varchar); " +
                    "ALTER TABLE ONLY tSchema.tTable ADD CONSTRAINT tTable_pkey PRIMARY KEY (objectid); " +
                    "ALTER TABLE ONLY tSchema.tTable " +
                        "ADD CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406));",
                resultSql);
    }

    private List<MatchingPair> getSimpleMatchingPairs(String jsonAsString) {
        List<MatchingPair> matchingPairs = new ArrayList<>();

        try {
            matchingPairs = mapper.readValue(jsonAsString, new TypeReference<List<MatchingPair>>() {
            });
        } catch (IOException e) {
            System.out.println("Incorrect source string");
        }

        return matchingPairs;
    }
}
