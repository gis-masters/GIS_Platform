package ru.mycrg.data_service.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.enums.ValueType;

import java.util.List;
import java.util.Map;
import java.util.Objects;

public class ImportValidationHandler {

    private static final Logger log = LoggerFactory.getLogger(ImportValidationHandler.class);

    private ImportValidationHandler() {
        throw new IllegalStateException("Utility class");
    }

    public static Map<String, Object> removeNonMatchingBySchemaProperties(Map<String, Object> dataForValidation,
                                                                          List<SimplePropertyDto> propertiesBySchema) {
        for (SimplePropertyDto propertyBySchema: propertiesBySchema) {
            Object valueForValidation = dataForValidation.get(propertyBySchema.getName());
            if (Objects.nonNull(valueForValidation)) {
                ValueType valueType = propertyBySchema.getValueTypeAsEnum();
                try {
                    if (valueType.equals(ValueType.DOUBLE)) {
                        Double.parseDouble(valueForValidation.toString());
                    }
                    if (valueType.equals(ValueType.INT)) {
                        Integer.parseInt(valueForValidation.toString());
                    }
                } catch (NumberFormatException exception) {
                    log.warn("Type mismatch. {}", exception.getMessage());
                    dataForValidation.remove(propertyBySchema.getName());
                }
            }
        }

        return dataForValidation;
    }
}
