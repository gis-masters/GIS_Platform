package ru.mycrg.wrapper.service.import_;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.mq_queue_contract.BaseMqProcessRequest;
import ru.mycrg.mq_queue_contract.BaseMqProcessResponse;
import ru.mycrg.mq_queue_contract.ResourceProjection;
import ru.mycrg.mq_queue_contract.import_.*;
import ru.mycrg.wrapper.dao.BaseDaoService;
import ru.mycrg.wrapper.dao.DatasourceFactory;
import ru.mycrg.wrapper.queue.MqSender;

import java.util.List;

import static ru.mycrg.mq_queue_contract.enums.ProcessStatus.TASK_ERROR;
import static ru.mycrg.wrapper.dao.DaoProperties.*;

/**
 * Класс "делает" первый шаг в процессе импорта.
 * В случае неудачи откатывает свои изменения и генерит ошибку.
 */
@Service
public class InitialImportService extends AbstractImportChainItem {

    private static final Logger log = LoggerFactory.getLogger(InitialImportService.class);

    private final MqSender mqSender;
    private final BaseDaoService baseDaoService;
    private final DatasourceFactory datasourceFactory;

    public InitialImportService(BaseDaoService baseDaoService,
                                MqSender mqSender,
                                DatasourceFactory datasourceFactory) {
        this.mqSender = mqSender;
        this.baseDaoService = baseDaoService;
        this.datasourceFactory = datasourceFactory;
    }

    /**
     * Первый этап импорта
     * - Генерирование новой таблицы
     * - Сам импорт: перенос данных из источника в новую таблицу.
     */
    public void handle(BaseMqProcessRequest mqRequest, ImportMqTask importTask) {
        final String resource = importTask.getSourceResource().getResourceId();
        final String target = importTask.getTargetResource().getResourceId();
        log.debug("=== Start first stage. Import. From: {} to: {}", resource, target);

        try {
            String sourceDbName = importTask.getSourceResource().getDbName();
            JdbcTemplate jdbcTemplate = datasourceFactory.getJdbcTemplate(sourceDbName);

            List<MatchingPair> mapping = importTask.getPairs();
            MatchingPair ruleIdMapping = new MatchingPair(
                    new SourceAttribute(RULE_ID, "String"),
                    new TargetAttribute(RULE_ID, AS_IS)
            );

            if (ruleIdNotExist(mapping)) {
                mapping.add(ruleIdMapping);
            }

            baseDaoService.createTable(jdbcTemplate, importTask);

            mapping.remove(ruleIdMapping);

            baseDaoService.copy(jdbcTemplate, importTask);

            if (nextImporter != null) {
                nextImporter.handle(mqRequest, importTask);
            }
        } catch (Exception e) {
            String msg = String.format("Не удалось перенести данные из: %s в: %s", resource, target);
            log.error(msg, e);

            mqSender.send(
                    new BaseMqProcessResponse(mqRequest,
                            new ImportMqResponse(importTask), TASK_ERROR, "Error", msg));

            rollback(importTask);
        }
    }

    @Override
    public void rollback(ImportMqTask importTask) {
        log.warn("Rollback. Initial import: {}", importTask.getFeatureDescription().getName());

        String sourceDbName = importTask.getSourceResource().getDbName();
        String targetTableName = importTask.getTargetResource().getTableName();
        String targetSchemaName = importTask.getTargetResource().getSchemaName();
        JdbcTemplate jdbcTemplate = datasourceFactory.getJdbcTemplate(sourceDbName);

        ResourceProjection targetResource = new ResourceProjection(sourceDbName, targetSchemaName, targetTableName);

        final String tableName = targetResource.getTableName().toLowerCase();
        baseDaoService.delete(jdbcTemplate, targetResource.getSchemaName(), tableName);
        baseDaoService.delete(jdbcTemplate, targetResource.getSchemaName(), tableName + EXTENSION_POSTFIX);
    }

    private boolean ruleIdNotExist(List<MatchingPair> pairs) {
        return pairs
                .stream()
                .noneMatch(pair -> RULE_ID.equalsIgnoreCase(pair.getSource().getName()));
    }
}
