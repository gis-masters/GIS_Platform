package ru.mycrg.wrapper.service.import_;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.mq_queue_contract.BaseMqProcessRequest;
import ru.mycrg.mq_queue_contract.BaseMqProcessResponse;
import ru.mycrg.mq_queue_contract.ResourceProjection;
import ru.mycrg.mq_queue_contract.SchemaDto;
import ru.mycrg.mq_queue_contract.import_.ImportMqResponse;
import ru.mycrg.mq_queue_contract.import_.ImportMqTask;
import ru.mycrg.wrapper.dao.BaseDaoService;
import ru.mycrg.wrapper.dao.DaoProperties;
import ru.mycrg.wrapper.dao.DatasourceFactory;
import ru.mycrg.wrapper.queue.MqSender;

import java.util.*;
import java.util.stream.Collectors;

import static ru.mycrg.mq_queue_contract.enums.ProcessStatus.TASK_ERROR;
import static ru.mycrg.wrapper.dao.DaoProperties.PRIMARY_KEY;

@Service
public class PostImportService extends AbstractImportChainItem {

    private static final Logger log = LoggerFactory.getLogger(PostImportService.class);

    private final MqSender mqSender;
    private final DataHandler dataHandler;
    private final BaseDaoService baseDaoService;
    private final DatasourceFactory datasourceFactory;

    public PostImportService(BaseDaoService baseDaoService,
                             DataHandler dataHandler,
                             MqSender mqSender,
                             DatasourceFactory datasourceFactory) {
        this.mqSender = mqSender;
        this.dataHandler = dataHandler;
        this.baseDaoService = baseDaoService;
        this.datasourceFactory = datasourceFactory;
    }

    public void handle(BaseMqProcessRequest mqRequest, ImportMqTask importTask) {
        log.debug("Start additional handles");

        try {
            String sourceDbName = importTask.getSourceResource().getDbName();
            String targetTableName = importTask.getTargetResource().getTableName();
            String targetSchemaName = importTask.getTargetResource().getSchemaName();
            SchemaDto fDescription = importTask.getFeatureDescription();
            JdbcTemplate jdbcTemplate = datasourceFactory.getJdbcTemplate(sourceDbName);

            log.debug("start postHandle");

            ResourceProjection resProjection = new ResourceProjection(null, targetSchemaName, targetTableName);

            int offset = 0;
            while (true) {
                // Выбираем
                List<Map<String, Object>> batch = baseDaoService.fetchBatch(
                        jdbcTemplate, resProjection, PRIMARY_KEY, DaoProperties.BATCH_SIZE, offset);
                if (batch.isEmpty()) {
                    break;
                }

                // Обрабатываем
                List<Map<String, Object>> handledBatch = batch.stream()
                        // .stream().parallel()
                        .map(dbRow -> dataHandler.handle(dbRow, fDescription))
                        .collect(Collectors.toList());

                // Сохраняем
                baseDaoService.updateBatch(jdbcTemplate, resProjection, handledBatch);

                offset++;

                log.debug("Update next batch: {}", offset);
            }

            if (nextImporter != null) {
                nextImporter.handle(mqRequest, importTask);
            }
        } catch (Exception e) {
            String msg = "Не удалось выполнить доп. обработку ресурса: " + importTask.printTarget();
            log.error(msg, e);

            mqSender.send(
                    new BaseMqProcessResponse(mqRequest,
                            new ImportMqResponse(importTask), TASK_ERROR, "", msg));

            if (previousImporter != null) {
                previousImporter.rollback(importTask);
            }
        }
    }
}
