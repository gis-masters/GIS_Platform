package ru.mycrg.wrapper.service.import_;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.common.ResourceProjection;
import ru.mycrg.common.import_.ImportMqTask;
import ru.mycrg.wrapper.dao.BaseDaoService;
import ru.mycrg.wrapper.dao.DatasourceFactory;
import ru.mycrg.wrapper.exceptions.CrgImportException;

/**
 * Класс "делает" первый шаг в процессе импорта.
 * В случае неудачи откатывает свои изменения и генерит ошибку.
 */
@Service
public class InitialImportService implements CrgImporter {

    private static final Logger log = LoggerFactory.getLogger(InitialImportService.class);

    private CrgImporter nextImporter;
    private CrgImporter previousImporter;

    private final BaseDaoService baseDaoService;
    private final DatasourceFactory datasourceFactory;

    public InitialImportService(BaseDaoService baseDaoService,
                                DatasourceFactory datasourceFactory) {
        this.baseDaoService = baseDaoService;
        this.datasourceFactory = datasourceFactory;
    }

    @Override
    public void setHandlers(CrgImporter nextImporter, CrgImporter previousImporter) {
        this.nextImporter = nextImporter;
        this.previousImporter = previousImporter;
    }

    /**
     * Первый этап импорта
     * - Удаление целевой таблицы и таблицы с данными валидации (*_extension)
     * - Генерирование новой таблицы
     * - Сам импорт: перенос данных из источника в новую таблицу.
     */
    @Transactional
    public void doImport(ImportMqTask importTask) {
        log.debug("Start first stage of import. From: {} to: {}", importTask.printSource(), importTask.printTarget());

        try {
            String sourceDbName = importTask.getSourceResource().getDbName();
            String targetTableName = importTask.getTargetResource().getTableName();
            String targetSchemaName = importTask.getTargetResource().getSchemaName();
            JdbcTemplate jdbcTemplate = datasourceFactory.getJdbcTemplate(sourceDbName);

            ResourceProjection targetResource = new ResourceProjection(sourceDbName, targetSchemaName, targetTableName);

            baseDaoService.delete(jdbcTemplate, targetResource);
            baseDaoService.createTable(jdbcTemplate, importTask);
            baseDaoService.copy(jdbcTemplate, importTask);

            nextImporter.doImport(importTask);
        } catch (Exception e) {
            String msg = String.format("Не удалось перенести данные из: %s в: %s", importTask.printSource(),
                    importTask.printTarget());

            log.error(msg, e);
            throw new CrgImportException(msg, e);
        }
    }

    @Override
    public void rollback(ImportMqTask importTask) {
        log.warn("I must do rollback 1");
    }

}
