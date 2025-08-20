package ru.mycrg.wrapper.service.import_;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.dto.ResourceProjection;
import ru.mycrg.data_service_contract.dto.import_.*;
import ru.mycrg.data_service_contract.queue.request.ImportRequestEvent;
import ru.mycrg.data_service_contract.queue.response.ImportResponseEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;
import ru.mycrg.wrapper.dao.BaseDaoService;
import ru.mycrg.wrapper.dao.DatasourceFactory;

import java.util.List;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.TASK_ERROR;
import static ru.mycrg.wrapper.dao.DaoProperties.*;

/**
 * Класс "делает" первый шаг в процессе импорта.
 * В случае неудачи откатывает свои изменения и генерит ошибку.
 */
@Service
public class CopyDataService extends AbstractImportChainItem {

    private static final Logger log = LoggerFactory.getLogger(CopyDataService.class);

    private final IMessageBusProducer messageBus;
    private final BaseDaoService baseDaoService;
    private final DatasourceFactory datasourceFactory;

    public CopyDataService(BaseDaoService baseDaoService,
                           IMessageBusProducer messageBus,
                           DatasourceFactory datasourceFactory) {
        this.messageBus = messageBus;
        this.baseDaoService = baseDaoService;
        this.datasourceFactory = datasourceFactory;
    }

    /**
     * Первый этап импорта
     * - Сам импорт: перенос данных из источника в новую таблицу.
     */
    public void handle(ImportRequestEvent event, ImportMqTask importTask) {
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

            mapping.remove(ruleIdMapping);

            baseDaoService.copy(jdbcTemplate, importTask);

            if (nextImporter != null) {
                nextImporter.handle(event, importTask);
            }
        } catch (Exception e) {
            String msg = String.format("Не удалось перенести данные из: %s в: %s", resource, target);
            log.error(msg, e);

            messageBus.produce(
                    new ImportResponseEvent(event, TASK_ERROR, "Error", msg, new ImportMqResponse(importTask)));

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
