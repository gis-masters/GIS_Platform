package ru.mycrg.data_service.kpt_import.validation;

import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.import_.KptImportValidationSettings;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;

/**
 * Имплементация валидатора импорта КПТ с общей логикой
 */
public abstract class CommonKptImportValidator implements KptImportValidator {

    public static final String TMP_TABLE_PREFIX = "kpt_";

    protected abstract void validateSchemaImport(KptImportValidationData data,
                                                 String tableName,
                                                 SchemaDto schema,
                                                 KptImportValidationSettings settings,
                                                 Map<String, List<KptImportValidationResult>> result);

    @Override
    public void validate(KptImportValidationData data,
                         Map<String, SchemaDto> tables,
                         KptImportValidationSettings settings,
                         Map<String, List<KptImportValidationResult>> results) {
        for (String tableName: tables.keySet()) {
            SchemaDto schema = tables.get(tableName);
            if (schemaSupportsValidation(schema)) {
                validateSchemaImport(data, tableName, schema, settings, results);
            } else {
                addResult(results, schema.getName(), KptImportLogLevel.WARN,
                          String.format("Схема %s не содержит поле source_doc, валидация пропущена", schema.getName()));
            }
        }
    }

    /**
     * Добавляет результат валидации в переданную map Map<String, List<KptImportValidationResult>> results
     */
    protected void addResult(Map<String, List<KptImportValidationResult>> results,
                             String tableName, KptImportLogLevel level,
                             String message) {
        results.computeIfAbsent(tableName, v -> new LinkedList<>())
               .add(new KptImportValidationResult(level, message));
    }

    protected boolean schemaSupportsValidation(SchemaDto schemaDto) {
        return schemaDto.getProperties().stream().anyMatch(property -> "source_doc".equals(property.getName()));
    }
}
