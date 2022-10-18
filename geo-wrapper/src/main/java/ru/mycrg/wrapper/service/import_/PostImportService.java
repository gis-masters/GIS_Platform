package ru.mycrg.wrapper.service.import_;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.dto.ResourceProjection;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.import_.ImportMqResponse;
import ru.mycrg.data_service_contract.dto.import_.ImportMqTask;
import ru.mycrg.data_service_contract.queue.request.ImportRequestEvent;
import ru.mycrg.data_service_contract.queue.response.ImportResponseEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;
import ru.mycrg.wrapper.dao.BaseDaoService;
import ru.mycrg.wrapper.dao.DaoProperties;
import ru.mycrg.wrapper.dao.DatasourceFactory;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.TASK_ERROR;
import static ru.mycrg.wrapper.dao.DaoProperties.PRIMARY_KEY;

@Service
public class PostImportService extends AbstractImportChainItem {

    private static final Logger log = LoggerFactory.getLogger(PostImportService.class);

    private final IMessageBusProducer messageBus;
    private final DataHandler dataHandler;
    private final BaseDaoService baseDaoService;
    private final DatasourceFactory datasourceFactory;

    public PostImportService(BaseDaoService baseDaoService,
                             DataHandler dataHandler,
                             IMessageBusProducer messageBus,
                             DatasourceFactory datasourceFactory) {
        this.messageBus = messageBus;
        this.dataHandler = dataHandler;
        this.baseDaoService = baseDaoService;
        this.datasourceFactory = datasourceFactory;
    }

    public void handle(ImportRequestEvent event, ImportMqTask importTask) {
        log.debug("Start additional handles");

        try {
            String sourceDbName = importTask.getSourceResource().getDbName();
            JdbcTemplate jdbcTemplate = datasourceFactory.getJdbcTemplate(sourceDbName);

            log.debug("start postHandle");

            ResourceProjection resProjection = importTask.getTargetResource();
            final SchemaDto schema = importTask.getTargetResource().getSchema();

            int offset = 0;
            while (true) {
                // Выбираем
                List<Map<String, Object>> batch = baseDaoService.fetchBatch(
                        jdbcTemplate, resProjection, PRIMARY_KEY, DaoProperties.BATCH_SIZE, offset, 28406);
                if (batch.isEmpty()) {
                    break;
                }

                // Обрабатываем
                List<Map<String, Object>> handledBatch = batch.stream()
                        // .stream().parallel()
                        .map(dbRow -> dataHandler.handle(dbRow, schema))
                        .collect(Collectors.toList());

                // Сохраняем
                baseDaoService.updateBatch(jdbcTemplate, resProjection, handledBatch);

                offset++;

                log.debug("Update next batch: {}", offset);
            }

            if (nextImporter != null) {
                nextImporter.handle(event, importTask);
            }
        } catch (Exception e) {
            String msg = "Не удалось выполнить доп. обработку ресурса: " + importTask.getTargetResource().toString();
            log.error(msg, e);

            messageBus.produce(
                    new ImportResponseEvent(event, TASK_ERROR, "", msg, new ImportMqResponse(importTask)));

            if (previousImporter != null) {
                previousImporter.rollback(importTask);
            }
        }
    }
}
