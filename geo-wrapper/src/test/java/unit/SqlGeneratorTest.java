package unit;

import org.junit.Test;
import ru.mycrg.common.FeatureDescriptionDto;
import ru.mycrg.common.ResourceProjection;
import ru.mycrg.common.SimplePropertyDto;
import ru.mycrg.common.enums.ValueType;
import ru.mycrg.common.import_.ImportMqTask;
import ru.mycrg.wrapper.dao.SqlGenerator;

import static org.junit.Assert.assertEquals;

public class SqlGeneratorTest {

    @Test
    public void shouldGenerateSqlRequest_simpleCase() {
        SimplePropertyDto stringPropertySchema = new SimplePropertyDto();
        stringPropertySchema.setValueType(ValueType.STRING);
        stringPropertySchema.setName("some_string");

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

        // ACT
        String resultSql = SqlGenerator.prepareCreateTableRequest(importTask);

        assertEquals("CREATE TABLE tSchema.tTable (" +
                        "objectid integer NOT NULL, " +
                        "classid integer, " +
                        "some_string character varying(255)" +
                        "); " +
                        "ALTER TABLE ONLY tSchema.tTable ADD CONSTRAINT tTable_pkey PRIMARY KEY (objectid);",
                resultSql);
    }

    @Test
    public void shouldCorrectBuildSqlRequest_WhenExistSameAttributeName() {
        SimplePropertyDto stringPropertySchema = new SimplePropertyDto();
        stringPropertySchema.setValueType(ValueType.STRING);
        stringPropertySchema.setName("some_string");

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

        // ACT
        String resultSql = SqlGenerator.prepareCreateTableRequest(importTask);

        assertEquals("CREATE TABLE tSchema.tTable (" +
                        "objectid integer NOT NULL, " +
                        "classid integer, " +
                        "some_string character varying(255)" +
                        "); " +
                        "ALTER TABLE ONLY tSchema.tTable ADD CONSTRAINT tTable_pkey PRIMARY KEY (objectid);",
                resultSql);
    }
}
