package ru.mycrg.data_service.queue.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.BaseTemplateDao;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.data_service.service.processes.ProcessService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.util.JsonConverter;
import ru.mycrg.data_service_contract.queue.request.ShapeLoadedEvent;
import ru.mycrg.data_service_contract.queue.response.ShapeImportedEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import static ru.mycrg.data_service.dao.config.DatasourceFactory.INITIAL_SCHEMA_NAME;
import static ru.mycrg.data_service.dao.utils.SqlBuilder.buildCopyGeometryQuery;

@Service
public class ImportGeometryShapeEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(ImportGeometryShapeEventHandler.class);

    private final ProcessService processService;
    private final DatasourceFactory datasourceFactory;
    private final BaseTemplateDao baseTemplateDao;

    public ImportGeometryShapeEventHandler(ProcessService processService,
                                           DatasourceFactory datasourceFactory,
                                           BaseTemplateDao baseTemplateDao) {
        this.processService = processService;
        this.datasourceFactory = datasourceFactory;
        this.baseTemplateDao = baseTemplateDao;
    }

    @Override
    public String getEventType() {
        return "ShapeImportedEvent";
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        log.debug("In ShapeImportedEvent! ");
        ShapeImportedEvent event = (ShapeImportedEvent) mqEvent;
        ShapeLoadedEvent requestEvent = event.getImportGeometryShapeEvent();
        log.debug("In ShapeImportedEvent! {}", requestEvent);
        try {
            JdbcTemplate jdbcTemplate = new JdbcTemplate(
                    datasourceFactory.getDataSource(requestEvent.getDbName()));

            String copyQuery = buildCopyGeometryQuery(new ResourceQualifier(INITIAL_SCHEMA_NAME,
                                                                            requestEvent.getSourceTableName()),
                                                      new ResourceQualifier(requestEvent.getDatasetId(),
                                                                            requestEvent.getTargetTableName()));
            Long insertedQuantity = baseTemplateDao.queryForObject(jdbcTemplate, copyQuery, Long.class);

            processService.complete(requestEvent.getDbName(),
                                    requestEvent.getProcessId(),
                                    JsonConverter.toJsonNode(requestEvent));

            log.debug("Процесс успешно завершен");
        } catch (Exception e) {
            processService.error(requestEvent.getDbName(),
                                 requestEvent.getProcessId(),
                                 JsonConverter.toJsonNode(requestEvent));

            log.error("Не удалось корректно обработать ShapeImportedEvent. Причина: {}", e.getMessage());
        }
    }
}
