package unit;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Test;
import ru.mycrg.common.FeatureDescriptionDto;
import ru.mycrg.common.ResourceProjection;
import ru.mycrg.common.SimplePropertyDto;
import ru.mycrg.common.enums.ValueType;
import ru.mycrg.common.import_.ImportMqTask;
import ru.mycrg.common.import_.MatchingPair;
import ru.mycrg.wrapper.dao.SqlGenerator;

import java.io.IOException;
import java.util.List;

import static org.junit.Assert.assertEquals;

public class SqlGeneratorTest {

    private ObjectMapper mapper = new ObjectMapper();

    @Test
    public void shouldGenerateSqlRequest_withoutGeometry() throws IOException {
        SimplePropertyDto stringPropertySchema = new SimplePropertyDto();
        stringPropertySchema.setValueType(ValueType.STRING);
        stringPropertySchema.setName("NUMBER");

        SimplePropertyDto classIdPropertySchema = new SimplePropertyDto();
        classIdPropertySchema.setValueType(ValueType.INT);
        classIdPropertySchema.setName("CLASSID");

        FeatureDescriptionDto featureDescription = new FeatureDescriptionDto();
        featureDescription.addProperty(classIdPropertySchema);
        featureDescription.addProperty(stringPropertySchema);

        ImportMqTask importTask = new ImportMqTask();
        importTask.setSrs(28406);
        importTask.setSourceResource(new ResourceProjection("SDB", "sSchema", "sTable"));
        importTask.setTargetResource(new ResourceProjection("TDB", "tSchema", "tTable"));
        importTask.setFeatureDescription(featureDescription);
        importTask.setPairs(getSimpleMatchingPairs());

        // ACT
        String resultSql = SqlGenerator.prepareCreateTableRequest(importTask);

        assertEquals("CREATE TABLE tSchema.tTable (" +
                        "objectid integer NOT NULL, " +
                        "classid integer, " +
                        "number character varying(255), " +
                        "\"feature_le\" integer, " +
                        "\"feature__1\" varchar); " +
                        "ALTER TABLE ONLY tSchema.tTable " +
                        "ADD CONSTRAINT tTable_pkey PRIMARY KEY (objectid);",
                resultSql);
    }

    @Test
    public void shouldGenerateSqlRequest_withGeometry() throws IOException {
        SimplePropertyDto szzSizePropertySchema = new SimplePropertyDto();
        szzSizePropertySchema.setValueType(ValueType.DOUBLE);
        szzSizePropertySchema.setName("SZZ_SIZE");

        SimplePropertyDto statusPropertySchema = new SimplePropertyDto();
        statusPropertySchema.setValueType(ValueType.INT);
        statusPropertySchema.setName("STATUS");

        SimplePropertyDto geometryPropertySchema = new SimplePropertyDto();
        geometryPropertySchema.setValueType(ValueType.GEOMETRY);
        geometryPropertySchema.setName("shape");

        FeatureDescriptionDto featureDescription = new FeatureDescriptionDto();
        featureDescription.addProperty(szzSizePropertySchema);
        featureDescription.addProperty(statusPropertySchema);
        featureDescription.addProperty(geometryPropertySchema);

        ImportMqTask importTask = new ImportMqTask();
        importTask.setSrs(28406);
        importTask.setSourceResource(new ResourceProjection("SDB", "sSchema", "sTable"));
        importTask.setTargetResource(new ResourceProjection("TDB", "tSchema", "tTable"));
        importTask.setFeatureDescription(featureDescription);
        importTask.setPairs(getSimpleMatchingPairs());

        // ACT
        String resultSql = SqlGenerator.prepareCreateTableRequest(importTask);

        assertEquals("CREATE TABLE tSchema.tTable (" +
                        "objectid integer NOT NULL, " +
                        "\"feature_le\" integer, " +
                        "szz_size numeric(38,8), " +
                        "status integer, " +
                        "\"feature__1\" varchar, " +
                        "shape public.geometry, " +
                        "CONSTRAINT tTable_pkey PRIMARY KEY (objectid), " +
                        "CONSTRAINT enforce_srid_shape CHECK ((public.st_srid(shape) = 28406)));",
                resultSql);
    }

    private List<MatchingPair> getSimpleMatchingPairs() throws IOException {
        String pairs = "[\n" +
                "                {\n" +
                "                    \"source\": {\n" +
                "                        \"name\": \"the_geom\",\n" +
                "                        \"binding\": \"org.locationtech.jts.geom.MultiLineString\"\n" +
                "                    },\n" +
                "                    \"target\": {\n" +
                "                        \"name\": \"shape\",\n" +
                "                        \"type\": \"FromSchema\"\n" +
                "                    }\n" +
                "                },\n" +
                "                {\n" +
                "                    \"source\": {\n" +
                "                        \"name\": \"objectid\",\n" +
                "                        \"binding\": \"java.lang.Integer\"\n" +
                "                    },\n" +
                "                    \"target\": {\n" +
                "                        \"name\": \"objectid\",\n" +
                "                        \"type\": \"NotImport\"\n" +
                "                    }\n" +
                "                },\n" +
                "                {\n" +
                "                    \"source\": {\n" +
                "                        \"name\": \"classid\",\n" +
                "                        \"binding\": \"java.lang.Integer\"\n" +
                "                    },\n" +
                "                    \"target\": {\n" +
                "                        \"name\": \"CLASSID\",\n" +
                "                        \"type\": \"FromSchema\"\n" +
                "                    }\n" +
                "                },\n" +
                "                {\n" +
                "                    \"source\": {\n" +
                "                        \"name\": \"number\",\n" +
                "                        \"binding\": \"java.lang.String\"\n" +
                "                    },\n" +
                "                    \"target\": {\n" +
                "                        \"name\": \"NUMBER\",\n" +
                "                        \"type\": \"FromSchema\"\n" +
                "                    }\n" +
                "                },\n" +
                "                {\n" +
                "                    \"source\": {\n" +
                "                        \"name\": \"feature_le\",\n" +
                "                        \"binding\": \"java.lang.Integer\"\n" +
                "                    },\n" +
                "                    \"target\": {\n" +
                "                        \"name\": \"feature_le\",\n" +
                "                        \"type\": \"AsIs\"\n" +
                "                    }\n" +
                "                },\n" +
                "                {\n" +
                "                    \"source\": {\n" +
                "                        \"name\": \"szz_size\",\n" +
                "                        \"binding\": \"java.lang.Double\"\n" +
                "                    },\n" +
                "                    \"target\": {\n" +
                "                        \"name\": \"SZZ_SIZE\",\n" +
                "                        \"type\": \"FromSchema\"\n" +
                "                    }\n" +
                "                },\n" +
                "                {\n" +
                "                    \"source\": {\n" +
                "                        \"name\": \"status\",\n" +
                "                        \"binding\": \"java.lang.Integer\"\n" +
                "                    },\n" +
                "                    \"target\": {\n" +
                "                        \"name\": \"STATUS\",\n" +
                "                        \"type\": \"FromSchema\"\n" +
                "                    }\n" +
                "                },\n" +
                "                {\n" +
                "                    \"source\": {\n" +
                "                        \"name\": \"reg_status\",\n" +
                "                        \"binding\": \"java.lang.Integer\"\n" +
                "                    },\n" +
                "                    \"target\": {\n" +
                "                        \"name\": \"REG_STATUS\",\n" +
                "                        \"type\": \"FromSchema\"\n" +
                "                    }\n" +
                "                },\n" +
                "                {\n" +
                "                    \"source\": {\n" +
                "                        \"name\": \"globalid\",\n" +
                "                        \"binding\": \"java.lang.String\"\n" +
                "                    },\n" +
                "                    \"target\": {\n" +
                "                        \"name\": \"GLOBALID\",\n" +
                "                        \"type\": \"FromSchema\"\n" +
                "                    }\n" +
                "                },\n" +
                "                {\n" +
                "                    \"source\": {\n" +
                "                        \"name\": \"feature__1\",\n" +
                "                        \"binding\": \"java.lang.String\"\n" +
                "                    },\n" +
                "                    \"target\": {\n" +
                "                        \"name\": \"feature__1\",\n" +
                "                        \"type\": \"AsIs\"\n" +
                "                    }\n" +
                "                }\n" +
                "            ]";

        return mapper.readValue(pairs, new TypeReference<List<MatchingPair>>() {});
    }
}
