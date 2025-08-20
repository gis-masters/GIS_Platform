package ru.mycrg.data_service.kpt_import.validation;

import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.detached.TaskLogDetachedDao;
import ru.mycrg.common_contracts.generated.data_service.TaskLogDto;
import ru.mycrg.data_service_contract.dto.import_.ImportKptTableDto;
import ru.mycrg.data_service_contract.dto.import_.KptImportValidationSettings;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static ru.mycrg.data_service.kpt_import.KptImportUtils.DS_ID;
import static ru.mycrg.data_service.config.CrgCommonConfig.SYSTEM_USER_ID;

/**
 * Сервис, управляющей валидацией импортируемых КПТ
 */
@Service
public class KptValidator {

    /**
     * Цепь валидаторов, которые будут применены к импортируемым данным
     */
    private final List<KptImportValidator> validators;
    private final TaskLogDetachedDao taskLogDetachedDao;

    public KptValidator(List<KptImportValidator> validators, TaskLogDetachedDao taskLogDetachedDao) {
        this.validators = validators;
        this.taskLogDetachedDao = taskLogDetachedDao;
    }

    public Map<String, List<KptImportValidationResult>> validate(String cadastralSqare,
                                                                 KptImportValidationSettings settings,
                                                                 List<ImportKptTableDto> tables,
                                                                 String dbName,
                                                                 long taskId) {
        KptImportValidationData validationData = new KptImportValidationData(cadastralSqare, dbName);
        Map<String, List<KptImportValidationResult>> results = new HashMap<>();
        validators.forEach(validator -> validator.validate(validationData, tables, settings, results));
        for (String tableName: results.keySet()) {
            List<KptImportValidationResult> tableResults = results.get(tableName);
            for (KptImportValidationResult tableResult: tableResults) {
                taskLogDetachedDao.createTaskLog(dbName, new TaskLogDto("Импорт КПТ", taskId, SYSTEM_USER_ID), tableResult,
                                                 DS_ID);
            }
        }

        return results;
    }
}
