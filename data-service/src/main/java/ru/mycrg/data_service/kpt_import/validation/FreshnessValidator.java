package ru.mycrg.data_service.kpt_import.validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.common_utils.CrgGlobalProperties;
import ru.mycrg.data_service.dao.detached.KptImportDao;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.import_.KptImportValidationSettings;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

/**
 * Валидатор, сопоставляющий "свежесть" импортируемых данных КПТ с "свежестью" данных в результирующей таблице
 */
@Component
public class FreshnessValidator extends CommonKptImportValidator {

    private static final Logger log = LoggerFactory.getLogger(FreshnessValidator.class);
    private static final String OLD_DATA_TEMPLATE = "В результирующей таблице %s хранились более новые данные";
    private static final String DATE_FORMAT_ERROR_TEMPLATE = "Ошибка чтения даты \"свежести\" КПТ %s";
    private static final String DATE_COMPLETION_ERROR_TEMPLATE = "Ошибка получения \"свежести\" данных результирующей" +
            " таблицы %s";
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final KptImportDao validationDao;

    public FreshnessValidator(KptImportDao validationDao) {
        this.validationDao = validationDao;
    }

    @Override
    protected void validateSchemaImport(KptImportValidationData data,
                                        String tableName,
                                        SchemaDto schema,
                                        KptImportValidationSettings settings,
                                        Map<String, List<KptImportValidationResult>> results) {
        if (!settings.isValidateFreshness() || settings.getDateOrderCompletion() == null) {
            return;
        }

        LocalDateTime orderCompletion;
        try {
            orderCompletion = LocalDateTime.parse(settings.getDateOrderCompletion(), DATE_FORMAT);
        } catch (Exception ex) {
            String msg = String.format(DATE_FORMAT_ERROR_TEMPLATE, data.getCadastralSqare());
            log.error(msg);
            addResult(results, tableName, KptImportLogLevel.ERROR, msg);
            return;
        }

        ResourceQualifier resultTable = new ResourceQualifier(
                CrgGlobalProperties.getDefaultProjectName(data.getProjectId()), tableName
        );

        LocalDateTime resultTableDate;
        try {
            resultTableDate = validationDao.latestOrderCompletionDateByCadastralSquare(
                    data.getDbName(), data.getCadastralSqare(), resultTable);
        } catch (Exception ex) {
            String msg = String.format(DATE_COMPLETION_ERROR_TEMPLATE, resultTable);
            log.error(msg, ex);
            addResult(results, tableName, KptImportLogLevel.ERROR, msg);
            return;
        }

        if (resultTableDate != null && resultTableDate.truncatedTo(ChronoUnit.SECONDS).isAfter(orderCompletion)) {
            addResult(results, tableName, KptImportLogLevel.WARN,
                      String.format(OLD_DATA_TEMPLATE, resultTable));
        }
    }
}
