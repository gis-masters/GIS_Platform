package ru.mycrg.data_service.service.schemas;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ru.mycrg.data_service.exceptions.ErrorInfo;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class SchemaLogicValidatorTest {

    private SchemaLogicValidator slv;

    @BeforeEach
    void setUp() {
        slv = new SchemaLogicValidator();
    }

    @Test
    public void tableName_validLowercase_isValid() {
        SchemaDto schema = new SchemaDto();
        schema.setTableName("tablename");
        Set<ErrorInfo> errors = slv.validate(schema);
        assertEquals(0, errors.size());
    }

    @Test
    public void property_requiredAndHidden_isInvalid() {
        SchemaDto schema = new SchemaDto();
        schema.setTableName("validtable");

        SimplePropertyDto property = new SimplePropertyDto();
        property.setName("testProperty");
        property.setTitle("Test Property");
        property.setValueType("STRING");
        property.setRequired(true);
        property.setHidden(true);

        schema.addProperty(property);

        Set<ErrorInfo> errors = slv.validate(schema);
        assertEquals(1, errors.size());
        ErrorInfo error = errors.iterator().next();
        assertEquals("Свойство не может быть задано одновременно и required и hidden", error.getMessage());
    }

    @Test
    public void property_requiredAndNotHidden_isValid() {
        SchemaDto schema = new SchemaDto();
        schema.setTableName("validtable");

        SimplePropertyDto property = new SimplePropertyDto();
        property.setName("testProperty");
        property.setTitle("Test Property");
        property.setValueType("STRING");
        property.setRequired(true);
        property.setHidden(false);

        schema.addProperty(property);

        Set<ErrorInfo> errors = slv.validate(schema);
        assertEquals(0, errors.size());
    }

    @Test
    public void property_notRequiredAndHidden_isValid() {
        SchemaDto schema = new SchemaDto();
        schema.setTableName("validtable");

        SimplePropertyDto property = new SimplePropertyDto();
        property.setName("testProperty");
        property.setTitle("Test Property");
        property.setValueType("STRING");
        property.setRequired(false);
        property.setHidden(true);

        schema.addProperty(property);

        Set<ErrorInfo> errors = slv.validate(schema);
        assertEquals(0, errors.size());
    }

    @Test
    public void property_requiredNullAndHidden_isValid() {
        SchemaDto schema = new SchemaDto();
        schema.setTableName("validtable");

        SimplePropertyDto property = new SimplePropertyDto();
        property.setName("testProperty");
        property.setTitle("Test Property");
        property.setValueType("STRING");
        property.setRequired(null);
        property.setHidden(true);

        schema.addProperty(property);

        Set<ErrorInfo> errors = slv.validate(schema);
        assertEquals(0, errors.size());
    }

    @Test
    public void property_requiredAndReadOnly_noError() {
        SchemaDto schema = new SchemaDto();
        schema.setTableName("validtable");

        SimplePropertyDto property = new SimplePropertyDto();
        property.setName("testProperty");
        property.setTitle("Test Property");
        property.setValueType("STRING");
        property.setRequired(true);
        property.setReadOnly(true);

        schema.addProperty(property);

        Set<ErrorInfo> errors = slv.validate(schema);
        assertEquals(0, errors.size());
    }

    @Test
    public void multipleProperties_oneAsTitleEach_isInvalid() {
        SchemaDto schema = new SchemaDto();
        schema.setTableName("validtable");

        SimplePropertyDto property1 = new SimplePropertyDto();
        property1.setName("property1");
        property1.setTitle("Property 1");
        property1.setValueType("STRING");
        property1.setAsTitle(true);

        SimplePropertyDto property2 = new SimplePropertyDto();
        property2.setName("property2");
        property2.setTitle("Property 2");
        property2.setValueType("STRING");
        property2.setAsTitle(true);

        schema.addProperty(property1);
        schema.addProperty(property2);

        Set<ErrorInfo> errors = slv.validate(schema);
        assertEquals(1, errors.size());
        ErrorInfo error = errors.iterator().next();
        assertEquals("Только одно поле может быть помечено как asTitle", error.getMessage());
    }

    @Test
    public void multipleProperties_threeAsTitle_isInvalid() {
        SchemaDto schema = new SchemaDto();
        schema.setTableName("validtable");

        SimplePropertyDto property1 = new SimplePropertyDto();
        property1.setName("property1");
        property1.setTitle("Property 1");
        property1.setValueType("STRING");
        property1.setAsTitle(true);

        SimplePropertyDto property2 = new SimplePropertyDto();
        property2.setName("property2");
        property2.setTitle("Property 2");
        property2.setValueType("STRING");
        property2.setAsTitle(true);

        SimplePropertyDto property3 = new SimplePropertyDto();
        property3.setName("property3");
        property3.setTitle("Property 3");
        property3.setValueType("STRING");
        property3.setAsTitle(true);

        schema.addProperty(property1);
        schema.addProperty(property2);
        schema.addProperty(property3);

        Set<ErrorInfo> errors = slv.validate(schema);
        assertEquals(1, errors.size());
        ErrorInfo error = errors.iterator().next();
        assertEquals("Только одно поле может быть помечено как asTitle", error.getMessage());
    }

    @Test
    public void multipleProperties_oneAsTitle_isValid() {
        SchemaDto schema = new SchemaDto();
        schema.setTableName("validtable");

        SimplePropertyDto property1 = new SimplePropertyDto();
        property1.setName("property1");
        property1.setTitle("Property 1");
        property1.setValueType("STRING");
        property1.setAsTitle(true);

        SimplePropertyDto property2 = new SimplePropertyDto();
        property2.setName("property2");
        property2.setTitle("Property 2");
        property2.setValueType("STRING");
        property2.setAsTitle(false);

        schema.addProperty(property1);
        schema.addProperty(property2);

        Set<ErrorInfo> errors = slv.validate(schema);
        assertEquals(0, errors.size());
    }

    @Test
    public void multipleProperties_noAsTitle_isValid() {
        SchemaDto schema = new SchemaDto();
        schema.setTableName("validtable");

        SimplePropertyDto property1 = new SimplePropertyDto();
        property1.setName("property1");
        property1.setTitle("Property 1");
        property1.setValueType("STRING");
        property1.setAsTitle(false);

        SimplePropertyDto property2 = new SimplePropertyDto();
        property2.setName("property2");
        property2.setTitle("Property 2");
        property2.setValueType("STRING");
        property2.setAsTitle(null);

        schema.addProperty(property1);
        schema.addProperty(property2);

        Set<ErrorInfo> errors = slv.validate(schema);
        assertEquals(0, errors.size());
    }

    @Test
    public void property_onlyHidden_isValid() {
        SchemaDto schema = new SchemaDto();
        schema.setTableName("validtable");

        SimplePropertyDto property = new SimplePropertyDto();
        property.setName("hiddenProperty");
        property.setTitle("Hidden Property");
        property.setValueType("STRING");
        property.setHidden(true);

        schema.addProperty(property);

        Set<ErrorInfo> errors = slv.validate(schema);
        assertEquals(0, errors.size());
    }

    @Test
    public void property_onlyRequired_isValid() {
        SchemaDto schema = new SchemaDto();
        schema.setTableName("validtable");

        SimplePropertyDto property = new SimplePropertyDto();
        property.setName("requiredProperty");
        property.setTitle("Required Property");
        property.setValueType("STRING");
        property.setRequired(true);

        schema.addProperty(property);

        Set<ErrorInfo> errors = slv.validate(schema);
        assertEquals(0, errors.size());
    }

    @Test
    public void property_onlyReadOnly_isValid() {
        SchemaDto schema = new SchemaDto();
        schema.setTableName("validtable");

        SimplePropertyDto property = new SimplePropertyDto();
        property.setName("readOnlyProperty");
        property.setTitle("ReadOnly Property");
        property.setValueType("STRING");
        property.setReadOnly(true);

        schema.addProperty(property);

        Set<ErrorInfo> errors = slv.validate(schema);
        assertEquals(0, errors.size());
    }

    @Test
    public void property_requiredFalseAndHiddenTrue_isValid() {
        SchemaDto schema = new SchemaDto();
        schema.setTableName("validtable");

        SimplePropertyDto property = new SimplePropertyDto();
        property.setName("property");
        property.setTitle("Property");
        property.setValueType("STRING");
        property.setRequired(false);
        property.setHidden(true);

        schema.addProperty(property);

        Set<ErrorInfo> errors = slv.validate(schema);
        assertEquals(0, errors.size());
    }
}
