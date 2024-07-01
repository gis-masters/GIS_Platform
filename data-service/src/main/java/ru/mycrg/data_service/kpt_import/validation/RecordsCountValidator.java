package ru.mycrg.data_service.kpt_import.validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.detached.KptImportDao;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.import_.KptImportValidationSettings;

import java.util.List;
import java.util.Map;

import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.kpt_import.KptImportUtils.tmbTableName;

/**
 * Валидтор, сопоставляющий количество импортируемых записей с количеством записей в результирующей таблице
 */
@Component
public class RecordsCountValidator extends CommonKptImportValidator {

    private static final Logger log = LoggerFactory.getLogger(RecordsCountValidator.class);

    private static final String ERROR_TEMPLATE = "Ошибка подсчета количества записей в таблице %s";

    private final KptImportDao validationDao;

    public RecordsCountValidator(KptImportDao validationDao) {
        this.validationDao = validationDao;
    }

    @Override
    protected void validateSchemaImport(KptImportValidationData data,
                                        ResourceQualifier resultTable,
                                        SchemaDto schema,
                                        KptImportValidationSettings settings,
                                        Map<String, List<KptImportValidationResult>> results) {
        if (!settings.isValidateRecordsCount()) {
            return;
        }

        String cadastralSqare = data.getCadastralSqare();
        String dbName = data.getDbName();
        ResourceQualifier tmpTable = new ResourceQualifier(SYSTEM_SCHEMA_NAME, tmbTableName(schema.getName()));
        int countToImport;
        int currentCount;

        try {
            countToImport = validationDao.countRecordsByCadastralSquare(cadastralSqare, dbName, tmpTable);
        } catch (Exception ex) {
            String msg = String.format(ERROR_TEMPLATE, tmpTable);
            log.error(msg, ex);
            addResult(results, resultTable.getTable(), KptImportLogLevel.ERROR, msg);

            return;
        }

        try {
            currentCount = validationDao.countRecordsByCadastralSquare(cadastralSqare, dbName, resultTable);
        } catch (Exception ex) {
            String msg = String.format(ERROR_TEMPLATE, resultTable);
            log.error(msg, ex);
            addResult(results, resultTable.getTable(), KptImportLogLevel.ERROR, msg);

            return;
        }

        int allowedDiff = settings.getAllowedDiff();
        if (countToImport + allowedDiff <= currentCount) {
            String msg = String.format("Во временной таблице %s записей значимо меньше или равно(на константу (%d)), " +
                                               "чем в результирующей %s для квартала %s",
                                       tmpTable, allowedDiff, resultTable, cadastralSqare);

            addResult(results, resultTable.getTable(), KptImportLogLevel.WARN, msg);
        } else if (countToImport + allowedDiff > currentCount) {
            String msg = String.format("Во временной таблице %s больше записей чем в результирующей %s за вычетом " +
                                               "константы (%d) для квартала %s",
                                       tmpTable, resultTable, allowedDiff, cadastralSqare);

            addResult(results, resultTable.getTable(), KptImportLogLevel.SUCCESS, msg);
        }
    }
}
