package ru.mycrg.data_service.kpt_import.validation;

import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.import_.ImportKptTableDto;
import ru.mycrg.data_service_contract.dto.import_.KptImportValidationSettings;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;

/**
 * Имплементация валидатора импорта КПТ с общей логикой
 */
public abstract class CommonKptImportValidator implements KptImportValidator {

    protected abstract void validateSchemaImport(KptImportValidationData data,
                                                 ResourceQualifier table,
                                                 SchemaDto schema,
                                                 KptImportValidationSettings settings,
                                                 Map<String, List<KptImportValidationResult>> result);

    @Override
    public void validate(KptImportValidationData data,
                         List<ImportKptTableDto> tables,
                         KptImportValidationSettings settings,
                         Map<String, List<KptImportValidationResult>> results) {
        for (ImportKptTableDto tableDto: tables) {
            if (schemaSupportsValidation(tableDto.getSchema())) {
                validateSchemaImport(data, new ResourceQualifier(tableDto.getDataset(), tableDto.getTable()),
                                     tableDto.getSchema(), settings, results);
            } else {
                addResult(results, tableDto.getTable(), KptImportLogLevel.WARN,
                          String.format("Схема %s не содержит поле source_doc, валидация пропущена",
                                        tableDto.getSchema().getName()));
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
