package ru.mycrg.gis.unit;

import org.junit.Test;
import ru.mycrg.gis.service.fgistp.EntityType;
import ru.mycrg.gis.service.fgistp.propertyTypes.AbstractProperty;
import ru.mycrg.gis.service.fgistp.propertyTypes.StringProperty;
import ru.mycrg.gis.service.validation.ConstraintViolationImpl;
import ru.mycrg.gis.service.validation.FgistpValidator;
import ru.mycrg.gis.service.validation.IValidator;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import static org.junit.Assert.assertEquals;

public class ValidatorTest {

    @Test
    public void validationTest() {
        IValidator validator = new FgistpValidator();

        EntityType entityType = new EntityType("Fiz_Type");
        entityType.setDescription("test description");
        entityType.setTitle("test title");
        entityType.setTableName("test tableName");

        StringProperty stringProperty = new StringProperty();
        stringProperty.setName("CLASSID");
        stringProperty.setRequired(true);

        List<AbstractProperty> properties = new ArrayList<>();
        properties.add(stringProperty);

        entityType.setProperties(properties);

        HashMap<String, String> data = new HashMap<>();
        data.put("CLASSID", null);

        List<ConstraintViolationImpl> errors = validator.validate(entityType, data);

        assertEquals(1, errors.size());
    }

}
