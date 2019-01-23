package unit;

import org.junit.Test;
import ru.mycrg.common.ConstraintViolation;
import ru.mycrg.common.EntityTypeDto;
import ru.mycrg.common.SimplePropertyDto;
import ru.mycrg.common.enums.ValueType;
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

        SimplePropertyDto validInt = new SimplePropertyDto();
        validInt.setValueType(ValueType.INT);
        validInt.setName("valid_INT");
        validInt.setMinInclusive(0);

        SimplePropertyDto notValidInt = new SimplePropertyDto();
        notValidInt.setValueType(ValueType.INT);
        notValidInt.setName("not_valid_INT");
        notValidInt.setMinInclusive(0);

        SimplePropertyDto validDouble = new SimplePropertyDto();
        validDouble.setValueType(ValueType.DOUBLE);
        validDouble.setName("validDouble");
        validDouble.setTotalDigits(10);

        List<SimplePropertyDto> properties = new ArrayList<>();
        properties.add(classId);
        properties.add(shortClassId);
        properties.add(validClassId);
        properties.add(longClassId);
        properties.add(tooSmallInt);
        properties.add(validInt);
        properties.add(notValidInt);
        properties.add(validDouble);

        EntityTypeDto entityType = new EntityTypeDto();
        entityType.setName("Fiz_Type");
        entityType.setDescription("test description");
        entityType.setTitle("test title");
        entityType.setTableName("test tableName");
        entityType.setProperties(properties);

        HashMap<String, Object> rowFromDb = new HashMap<>();
        rowFromDb.put("objectid", "314");
        rowFromDb.put("CLASSID", null);
        rowFromDb.put("CLASSID_short", "short");
        rowFromDb.put("CLASSID_valid", "valid_class_id");
        rowFromDb.put("CLASSID_long", "too_long_class_id");
        rowFromDb.put("INT_too_small", "5");
        rowFromDb.put("valid_INT", "5");
        rowFromDb.put("not_valid_INT", "not_valid_value");
        rowFromDb.put("validDouble", 3.1415);

        ConstraintViolation constraintViolation = validator.validate(entityType, rowFromDb);

        assertEquals("314", constraintViolation.getId());
        assertEquals(5, constraintViolation.getPropertyViolations().size());
        assertEquals(1, constraintViolation.getPropertyViolations().get(0).getErrors().size());
        assertEquals(1, constraintViolation.getPropertyViolations().get(1).getErrors().size());
        assertEquals(1, constraintViolation.getPropertyViolations().get(2).getErrors().size());
    }

}
