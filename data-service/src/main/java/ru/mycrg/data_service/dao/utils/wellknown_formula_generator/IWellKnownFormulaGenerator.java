package ru.mycrg.data_service.dao.utils.wellknown_formula_generator;

import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Класс используется для генерации calculatedValueWellKnownFormula для расчёта ruleId по схемам.
 */
public interface IWellKnownFormulaGenerator {

    String generate();

    String getType();

    String validate(SchemaDto schema);

    default String validate(SchemaDto schema, Map<String, List<String>> allowedFieldTypes) {
        String validationResult = "";

        List<SimplePropertyDto> properties = schema.getProperties();
        Map<String, String> propertiesNameWithTypes = new HashMap<>();
        properties.forEach(dto -> propertiesNameWithTypes.put(dto.getName(), dto.getValueType()));

        List<String> absentFields = new ArrayList<>();
        List<String> incompatibleTypes = new ArrayList<>();

        for (String requiredField: allowedFieldTypes.keySet()) {
            if (!propertiesNameWithTypes.containsKey(requiredField)) {
                absentFields.add(requiredField);
            } else {
                String errorTypes = validateTypes(allowedFieldTypes, propertiesNameWithTypes, requiredField);
                if (!errorTypes.isEmpty()) {
                    incompatibleTypes.add(errorTypes);
                }
            }
        }
        if (!absentFields.isEmpty()) {
            validationResult = String.format("Для калькуляции по wellKnown формуле отсутствуют следующие поля: %s.",
                                             String.join(", ", absentFields));
        }
        if (!incompatibleTypes.isEmpty()) {
            validationResult = validationResult.isEmpty()
                    ? String.format("Для калькуляции по wellKnown формуле %s. ", String.join(", ", incompatibleTypes))
                    : String.format("%s %s", validationResult, String.join(", ", incompatibleTypes));
        }

        return validationResult;
    }

    private String validateTypes(Map<String, List<String>> allowedFieldTypes,
                                 Map<String, String> propertiesNameWithTypes,
                                 String requiredField) {
        String validationResult = "";

        String actualType = propertiesNameWithTypes.get(requiredField);
        List<String> requiredTypes = allowedFieldTypes.get(requiredField);
        long appropriateTypes = requiredTypes.stream()
                                             .filter(requiredType -> requiredType.equalsIgnoreCase(actualType))
                                             .count();
        if (appropriateTypes == 0) {
            validationResult = String.format("поле %s должно быть типа: %s", requiredField, requiredTypes);
        }

        return validationResult;
    }
}
