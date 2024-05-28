package ru.mycrg.data_service.util;

import org.junit.Test;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.enums.ValueType;

import java.util.*;

import static org.junit.Assert.*;

public class ImportValidationHandlerTest {

    @Test
    public void shouldCheckIsTypeOfFieldCorrectBySchema() {
        // Arrange
        String stringKey = "testString";
        String integerKey = "testInt";
        String doubleKey = "testDouble";
        String otherDataKey = "testOtherData";

        Map<String, Object> dataForCheckType = new HashMap<>();
        dataForCheckType.put(stringKey, "test");
        dataForCheckType.put(integerKey, "3ffdg");
        dataForCheckType.put(doubleKey, "1.0ffff");
        dataForCheckType.put(otherDataKey, UUID.randomUUID());

        SimplePropertyDto simplePropertyStringType = new SimplePropertyDto();
        simplePropertyStringType.setName(stringKey);
        simplePropertyStringType.setValueType(ValueType.STRING);

        SimplePropertyDto simplePropertyIntType = new SimplePropertyDto();
        simplePropertyIntType.setName(integerKey);
        simplePropertyIntType.setValueType(ValueType.INT);

        SimplePropertyDto simplePropertyDoubleType = new SimplePropertyDto();
        simplePropertyDoubleType.setName(doubleKey);
        simplePropertyDoubleType.setValueType(ValueType.DOUBLE);

        SimplePropertyDto simplePropertyOtherType = new SimplePropertyDto();
        simplePropertyOtherType.setName(otherDataKey);
        simplePropertyOtherType.setValueType(ValueType.UUID);

        List<SimplePropertyDto> simpleProperties = Arrays.asList(simplePropertyDoubleType, simplePropertyIntType,
                                                                 simplePropertyStringType, simplePropertyOtherType);

        // Act
        Map<String, Object> validDataForSavingDB = ImportValidationHandler
                .removeNonMatchingBySchemaProperties(dataForCheckType, simpleProperties);

        // Assert
        assertEquals(2, validDataForSavingDB.values().size());
        assertTrue(validDataForSavingDB.containsKey(stringKey));
        assertTrue(validDataForSavingDB.containsKey(otherDataKey));
        assertFalse(validDataForSavingDB.containsKey(doubleKey));
        assertFalse(validDataForSavingDB.containsKey(integerKey));
    }
}
