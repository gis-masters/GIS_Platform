package ru.mycrg.data_service.kpt_import.validation;

import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.import_.KptImportValidationSettings;

import java.util.List;
import java.util.Map;

/**
 * Интерфейс для всех валидаторов импорта КПТ
 */
public interface KptImportValidator {

    void validate(KptImportValidationData data,
                  Map<String, SchemaDto> tables,
                  KptImportValidationSettings settings,
                  Map<String, List<KptImportValidationResult>> result);
}
