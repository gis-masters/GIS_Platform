package ru.mycrg.data_service.kpt_import.validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.detached.KptImportDao;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.import_.KptImportValidationSettings;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

import static ru.mycrg.data_service.config.CrgCommonConfig.SYSTEM_DATETIME_PATTERN;

/**
 * Валидатор, сопоставляющий "свежесть" импортируемых данных КПТ с "свежестью" данных в результирующей таблице
 */
@Component
public class FreshnessValidator extends CommonKptImportValidator {

    private static final Logger log = LoggerFactory.getLogger(FreshnessValidator.class);

    private final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern(SYSTEM_DATETIME_PATTERN);

    private final KptImportDao validationDao;

    public FreshnessValidator(KptImportDao validationDao) {
        this.validationDao = validationDao;
    }

    @Override
    protected void validateSchemaImport(KptImportValidationData data,
                                        ResourceQualifier resultTable,
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
            String msg = "Ошибка чтения даты \"свежести\" КПТ: " + data.getCadastralSqare();
            log.error(msg);
            addResult(results, resultTable.getTable(), KptImportLogLevel.ERROR, msg);

            return;
        }

        LocalDateTime resultTableDate;
        try {
            resultTableDate = validationDao.latestOrderCompletionDateByCadastralSquare(
                    data.getDbName(), data.getCadastralSqare(), resultTable);
        } catch (Exception ex) {
            String msg = "Ошибка получения \"свежести\" данных результирующей таблицы: " + resultTable;
            log.error(msg, ex);
            addResult(results, resultTable.getTable(), KptImportLogLevel.ERROR, msg);

            return;
        }

        if (resultTableDate != null && resultTableDate.truncatedTo(ChronoUnit.SECONDS).isAfter(orderCompletion)) {
            addResult(results, resultTable.getTable(), KptImportLogLevel.WARN,
                      String.format("В результирующей таблице %s хранились более новые данные", resultTable));
        }
    }
}
