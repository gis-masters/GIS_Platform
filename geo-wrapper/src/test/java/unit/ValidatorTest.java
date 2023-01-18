package unit;

import org.junit.Test;
import ru.mycrg.common_utils.CrgScriptEngine;
import ru.mycrg.data_service_contract.dto.*;
import ru.mycrg.data_service_contract.enums.ValueType;
import ru.mycrg.wrapper.service.validation.IValidator;
import ru.mycrg.wrapper.service.validation.ValidatorImpl;
import ru.mycrg.wrapper.service.validation.constraints.MaxLengthValidation;
import ru.mycrg.wrapper.service.validation.constraints.MinLengthValidation;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import static org.junit.Assert.*;

public class ValidatorTest {

    @Test
    public void validateStringPropertyTest() {
        IValidator validator = new ValidatorImpl(new CrgScriptEngine());

        SimplePropertyDto classId = new SimplePropertyDto();
        classId.setValueType(ValueType.STRING);
        classId.setName("CLASSID");
        classId.setRequired(true);
        classId.setMinLength(6);
        classId.setMaxLength(15);

        SimplePropertyDto shortClassId = new SimplePropertyDto();
        shortClassId.setValueType(ValueType.STRING);
        shortClassId.setName("CLASSID_short");
        shortClassId.setRequired(true);
        shortClassId.setMinLength(6);
        shortClassId.setMaxLength(15);

        SimplePropertyDto validClassId = new SimplePropertyDto();
        validClassId.setValueType(ValueType.STRING);
        validClassId.setName("CLASSID_valid");
        validClassId.setRequired(true);
        validClassId.setMinLength(6);
        validClassId.setMaxLength(15);

        SimplePropertyDto longClassId = new SimplePropertyDto();
        longClassId.setValueType(ValueType.STRING);
        longClassId.setName("CLASSID_long");
        longClassId.setRequired(true);
        longClassId.setMinLength(6);
        longClassId.setMaxLength(15);

        SimplePropertyDto tooSmallInt = new SimplePropertyDto();
        tooSmallInt.setValueType(ValueType.INT);
        tooSmallInt.setName("INT_too_small");
        tooSmallInt.setMinInclusive(10);
        tooSmallInt.setRequired(true);

        SimplePropertyDto validInt = new SimplePropertyDto();
        validInt.setValueType(ValueType.INT);
        validInt.setName("valid_INT");
        validInt.setMinInclusive(0);
        validInt.setRequired(true);

        SimplePropertyDto notValidInt = new SimplePropertyDto();
        notValidInt.setValueType(ValueType.INT);
        notValidInt.setName("not_valid_INT");
        notValidInt.setMinInclusive(0);
        notValidInt.setRequired(true);

        SimplePropertyDto validDouble = new SimplePropertyDto();
        validDouble.setValueType(ValueType.DOUBLE);
        validDouble.setName("validDouble");
        validDouble.setTotalDigits(10);
        validDouble.setRequired(true);

        List<ValueTitleProjection> enumerations = new ArrayList<>();
        enumerations.add(new ValueTitleProjection("1", "t1"));
        enumerations.add(new ValueTitleProjection("2", "t2"));
        enumerations.add(new ValueTitleProjection("3", "t3"));

        SimplePropertyDto validEnum = new SimplePropertyDto();
        validEnum.setValueType(ValueType.CHOICE);
        validEnum.setName("validEnum");
        validEnum.setEnumerations(enumerations);

        List<SimplePropertyDto> properties = new ArrayList<>();
        properties.add(classId);
        properties.add(shortClassId);
        properties.add(validClassId);
        properties.add(longClassId);
        properties.add(tooSmallInt);
        properties.add(validInt);
        properties.add(notValidInt);
        properties.add(validDouble);
        properties.add(validEnum);

        SchemaDto schemaDto = new SchemaDto();
        schemaDto.setName("Fiz_Type");
        schemaDto.setDescription("test description");
        schemaDto.setTitle("test title");
        schemaDto.setTableName("test tableName");
        schemaDto.setProperties(properties);

        HashMap<String, Object> rowFromDb = new HashMap<>();
        rowFromDb.put("CLASSID", null);
        rowFromDb.put("CLASSID_short", "short");
        rowFromDb.put("CLASSID_valid", "valid_class_id");
        rowFromDb.put("CLASSID_long", "too_long_class_id");
        rowFromDb.put("INT_too_small", "5");
        rowFromDb.put("valid_INT", "5");
        rowFromDb.put("not_valid_INT", "not_valid_value");
        rowFromDb.put("validDouble", 3.1415);
        rowFromDb.put("validEnum", "3");

        ObjectValidationResult objectValidationResult = validator.validate(schemaDto, rowFromDb);

        assertEquals(5, objectValidationResult.getPropertyViolations().size());
        assertEquals(1, objectValidationResult.getPropertyViolations().get(0).getErrorTypes().size());
        assertEquals(1, objectValidationResult.getPropertyViolations().get(1).getErrorTypes().size());
        assertEquals(1, objectValidationResult.getPropertyViolations().get(2).getErrorTypes().size());
    }

    @Test
    public void validateCustomRules_Status_MustBeEmpty() {
        IValidator validator = new ValidatorImpl(new CrgScriptEngine());

        SimplePropertyDto classId = new SimplePropertyDto();
        classId.setValueType(ValueType.STRING);
        classId.setName("classid");
        classId.setRequired(true);
        classId.setMinLength(3);
        classId.setMaxLength(15);

        SimplePropertyDto status = new SimplePropertyDto();
        status.setValueType(ValueType.INT);
        status.setName("status");

        SimplePropertyDto fpType = new SimplePropertyDto();
        fpType.setValueType(ValueType.CHOICE);
        fpType.setName("fp_type");

        List<SimplePropertyDto> properties = new ArrayList<>();
        properties.add(classId);
        properties.add(status);
        properties.add(fpType);

        SchemaDto schemaDto = new SchemaDto();
        schemaDto.setName("Fiz_Type");
        schemaDto.setDescription("test description");
        schemaDto.setTitle("test title");
        schemaDto.setTableName("test tableName");
        schemaDto.setProperties(properties);
        schemaDto.setCustomRuleFunction("" +
                "  var errors = [];\n" +
                "\n" +
                "  // В приказе - \"Н\"\n" +
                "  if (!(obj.classid == '604010103' || obj.classid == '604010104')) {\n" +
                "    if (obj.status) {\n" +
                "      errors.push({attribute: 'status', error: 'Параметр должен быть не заполнен'});\n" +
                "    }\n" +
                "  }\n" +
                "\n" +
                "  // В приказе - \"У\"\n" +
                "  if (obj.classid == '602050202') {\n" +
                "    if (!obj.fp_type) {\n" +
                "      errors.push({attribute: 'fp_type', error: 'Параметр обязателен к заполнению'});\n" +
                "    }\n" +
                "  } else {\n" +
                "    if (obj.fp_type) {\n" +
                "      errors.push({attribute: 'fp_type', error: 'Параметр должен быть не заполнен'});\n" +
                "    }\n" +
                "  }\n" +
                "\n" +
                "  return errors;\n");

        HashMap<String, Object> rowFromDb = new HashMap<>();
        rowFromDb.put("classid", "602050202");
        rowFromDb.put("fp_type", "1");
        rowFromDb.put("status", "1");

        ObjectValidationResult objectValidationResult = validator.validate(schemaDto, rowFromDb);

        List<ErrorDescription> objectViolations = objectValidationResult.getObjectViolations();
        assertEquals(1, objectViolations.size());
        assertEquals("status", objectViolations.get(0).getAttribute());
        assertEquals("Параметр должен быть не заполнен", objectViolations.get(0).getError());
    }

    @Test
    public void should_ValidateMaxLength() {
        MaxLengthValidation maxLengthValidation = new MaxLengthValidation();

        SimplePropertyDto someAttr = new SimplePropertyDto();
        someAttr.setValueType(ValueType.STRING);
        someAttr.setName("someAttr");
        someAttr.setRequired(false);
        someAttr.setMaxLength(11);

        assertFalse(maxLengthValidation.isValid("string length 16", someAttr));
        assertTrue(maxLengthValidation.isValid("short", someAttr));
        assertTrue(maxLengthValidation.isValid("equal to 11", someAttr));
    }

    @Test
    public void should_ValidateMinLength() {
        MinLengthValidation minLengthValidation = new MinLengthValidation();

        SimplePropertyDto someAttr = new SimplePropertyDto();
        someAttr.setValueType(ValueType.STRING);
        someAttr.setName("someAttr");
        someAttr.setRequired(false);
        someAttr.setMinLength(5);

        assertTrue(minLengthValidation.isValid("string length 16", someAttr));
        assertFalse(minLengthValidation.isValid("not", someAttr));
        assertTrue(minLengthValidation.isValid("equal", someAttr));
    }
}
