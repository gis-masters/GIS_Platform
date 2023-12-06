package ru.mycrg.data_service.kpt_import.validation;

import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.detached.TaskLogDetachedDao;
import ru.mycrg.data_service.dto.TaskLogDto;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.import_.KptImportValidationSettings;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Сервис, управляющей валидацией импортируемых КПТ
 */
@Service
public class KptImportValidatorService {

    /**
     * Цепь валидаторов, которые будут применены к импортируемым данным
     */
    private final List<KptImportValidator> validators;
    private final TaskLogDetachedDao taskLogDetachedDao;

    public KptImportValidatorService(List<KptImportValidator> validators, TaskLogDetachedDao taskLogDetachedDao) {
        this.validators = validators;
        this.taskLogDetachedDao = taskLogDetachedDao;
    }

    public Map<String, List<KptImportValidationResult>> validate(String cadastralSqare,
                                                                 KptImportValidationSettings settings,
                                                                 Map<String, SchemaDto> tables,
                                                                 String dbName,
                                                                 long projectId,
                                                                 long taskId) {
        KptImportValidationData validationData = new KptImportValidationData(cadastralSqare, dbName, projectId);
        Map<String, List<KptImportValidationResult>> results = new HashMap<>();
        validators.forEach(validator -> validator.validate(validationData, tables, settings, results));
        for (String tableName: results.keySet()) {
            List<KptImportValidationResult> tableResults = results.get(tableName);
            for (KptImportValidationResult tableResult: tableResults) {
                taskLogDetachedDao.createTaskLog(dbName, new TaskLogDto("Импорт КПТ", taskId), tableResult);
            }
        }
        return results;
    }
}
