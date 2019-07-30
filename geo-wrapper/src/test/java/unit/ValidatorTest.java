package unit;

import org.junit.Test;
import ru.mycrg.common.FeatureDescriptionDto;
import ru.mycrg.common.ObjectValidationResult;
import ru.mycrg.common.SimplePropertyDto;
import ru.mycrg.common.enums.ValueType;
import ru.mycrg.common.propertyTypes.ValueTitleProjection;
import ru.mycrg.wrapper.service.validation.IValidator;
import ru.mycrg.wrapper.service.validation.ValidatorImpl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import static org.junit.Assert.assertEquals;

public class ValidatorTest {

    @Test
    public void validateStringPropertyTest() {
        IValidator validator = new ValidatorImpl();

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

        FeatureDescriptionDto featureDescriptionDto = new FeatureDescriptionDto();
        featureDescriptionDto.setName("Fiz_Type");
        featureDescriptionDto.setDescription("test description");
        featureDescriptionDto.setTitle("test title");
        featureDescriptionDto.setTableName("test tableName");
        featureDescriptionDto.setProperties(properties);

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

        ObjectValidationResult objectValidationResult = validator.validate(featureDescriptionDto, rowFromDb);

        assertEquals(5, objectValidationResult.getPropertyViolations().size());
        assertEquals(1, objectValidationResult.getPropertyViolations().get(0).getErrorTypes().size());
        assertEquals(1, objectValidationResult.getPropertyViolations().get(1).getErrorTypes().size());
        assertEquals(1, objectValidationResult.getPropertyViolations().get(2).getErrorTypes().size());
    }

    @Test
    public void validateCustomRules() {
        IValidator validator = new ValidatorImpl();

        SimplePropertyDto classId = new SimplePropertyDto();
        classId.setValueType(ValueType.STRING);
        classId.setName("classid");
        classId.setRequired(true);
        classId.setMinLength(3);
        classId.setMaxLength(15);

        List<SimplePropertyDto> properties = new ArrayList<>();
        properties.add(classId);

        FeatureDescriptionDto featureDescriptionDto = new FeatureDescriptionDto();
        featureDescriptionDto.setName("Fiz_Type");
        featureDescriptionDto.setDescription("test description");
        featureDescriptionDto.setTitle("test title");
        featureDescriptionDto.setTableName("test tableName");
        featureDescriptionDto.setProperties(properties);
        featureDescriptionDto.setCustomRuleFunction("var errors = []; if (obj.classid == 602040315) {if (Number(obj.wear_prcnt) " +
                "> 20) {errors.push('У объектов данного класса % износа должен быть не более 20');}}return errors;");

        HashMap<String, Object> rowFromDb = new HashMap<>();
        rowFromDb.put("classid", "602040315");
        rowFromDb.put("wear_prcnt", "30");

        ObjectValidationResult objectValidationResult = validator.validate(featureDescriptionDto, rowFromDb);

        assertEquals(1, objectValidationResult.getObjectViolations().size());
    }

    @Test
    public void should_DontCount_NotRequiredErrors() {
        IValidator validator = new ValidatorImpl();

        SimplePropertyDto classId = new SimplePropertyDto();
        classId.setValueType(ValueType.STRING);
        classId.setName("classid");
        classId.setRequired(false);
        classId.setMinLength(2);
        classId.setMaxLength(6);

        SimplePropertyDto requiredProperty = new SimplePropertyDto();
        requiredProperty.setValueType(ValueType.STRING);
        requiredProperty.setName("name");
        requiredProperty.setRequired(true);
        requiredProperty.setMinLength(2);
        requiredProperty.setMaxLength(10);

        List<SimplePropertyDto> properties = new ArrayList<>();
        properties.add(classId);
        properties.add(requiredProperty);

        FeatureDescriptionDto featureDescription = new FeatureDescriptionDto();
        featureDescription.setName("Fiz_Type");
        featureDescription.setDescription("test description");
        featureDescription.setTitle("test title");
        featureDescription.setTableName("test tableName");
        featureDescription.setProperties(properties);

        HashMap<String, Object> rowFromDb = new HashMap<>();
        rowFromDb.put("classid", "too long string");
        rowFromDb.put("name", "too long string");

        ObjectValidationResult objectValidationResult = validator.validate(featureDescription, rowFromDb);

        assertEquals(1, objectValidationResult.getPropertyViolations().size());
        assertEquals(1, objectValidationResult.getPropertyViolations().get(0).getErrorTypes().size());
    }

}
