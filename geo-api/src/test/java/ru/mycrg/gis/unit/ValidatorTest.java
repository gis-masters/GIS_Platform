package ru.mycrg.gis.unit;

import org.junit.Test;
import ru.mycrg.gis.service.fgistp.EntityType;
import ru.mycrg.gis.service.validation.ConstraintViolationImpl;
import ru.mycrg.gis.service.validation.FgistpValidator;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import static org.junit.Assert.assertEquals;

public class ValidatorTest {

    @Test
    public void validationTest() {
        FgistpValidator validator = new FgistpValidator();

        EntityType entityType = new EntityType("Fiz_Type");
        entityType.setDescription("test description");
        entityType.setTitle("test title");
        entityType.setTableName("test tableName");
        entityType.setProperties(new ArrayList<>());

        HashMap<String, String> data = new HashMap<>();

        List<ConstraintViolationImpl> errors = validator.validate(entityType, data);

        assertEquals(0, errors.size());
    }

}
