package ru.mycrg.data_service.queue.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.BaseTemplateDao;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.service.processes.ProcessService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.util.JsonConverter;
import ru.mycrg.data_service_contract.dto.ImportGeometryShapeReport;
import ru.mycrg.data_service_contract.queue.request.ShapeLoadedEvent;
import ru.mycrg.data_service_contract.queue.response.ShapeImportedSucceededEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import java.util.List;

import static ru.mycrg.data_service.dao.config.DatasourceFactory.INITIAL_SCHEMA_NAME;
import static ru.mycrg.data_service.dao.utils.SqlBuilder.buildCopyGeometryQuery;
import static ru.mycrg.data_service.dao.utils.SqlBuilder.buildGetGeometryTypeQuery;
import static ru.mycrg.data_service.util.GeometryHandler.isGeometryTypeMatch;

@Service
public class ImportGeometryShapeSucceededEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(ImportGeometryShapeSucceededEventHandler.class);

    private final ProcessService processService;
    private final DatasourceFactory datasourceFactory;
    private final BaseTemplateDao baseTemplateDao;

    public ImportGeometryShapeSucceededEventHandler(ProcessService processService,
                                                    DatasourceFactory datasourceFactory,
                                                    BaseTemplateDao baseTemplateDao) {
        this.processService = processService;
        this.datasourceFactory = datasourceFactory;
        this.baseTemplateDao = baseTemplateDao;
    }

    @Override
    public String getEventType() {
        return "ShapeImportedSucceededEvent";
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        ShapeImportedSucceededEvent event = (ShapeImportedSucceededEvent) mqEvent;
        ShapeLoadedEvent requestEvent = event.getImportGeometryShapeEvent();
        ImportGeometryShapeReport importGeometryReport = new ImportGeometryShapeReport();

        log.debug("In ShapeImportedSucceededEvent! {}", requestEvent);
        try {
            JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getDataSource(requestEvent.getDbName()));
            ResourceQualifier sourceTable = new ResourceQualifier(INITIAL_SCHEMA_NAME,
                                                                  requestEvent.getSourceTableName());
            ResourceQualifier targetTable = new ResourceQualifier(requestEvent.getDatasetId(),
                                                                  requestEvent.getTargetTableName());

            importGeometryReport.setDatasetIdentifier(targetTable.getSchema());
            importGeometryReport.setTableIdentifier(targetTable.getTableQualifier());

            throwsIfGeometryIsNotMatching(jdbcTemplate, sourceTable, requestEvent.getGeometryType());

            String copyQuery = buildCopyGeometryQuery(sourceTable, targetTable);
            Long insertedQuantity = baseTemplateDao.queryForObject(jdbcTemplate, copyQuery, Long.class);

            importGeometryReport.setSuccess(true);
            importGeometryReport.setQuantityOfImportedRecords(insertedQuantity);

            processService.complete(requestEvent.getDbName(),
                                    requestEvent.getProcessId(),
                                    JsonConverter.toJsonNode(importGeometryReport));

            log.debug("Процесс успешно завершен");
        } catch (Exception e) {
            String msg = "Не удалось корректно обработать ShapeImportedSucceededEvent. Причина: " + e.getMessage();
            log.error(msg);

            importGeometryReport.setSuccess(false);
            importGeometryReport.setQuantityOfImportedRecords(0L);
            importGeometryReport.setMessage(msg);

            processService.error(requestEvent.getDbName(),
                                 requestEvent.getProcessId(),
                                 JsonConverter.toJsonNode(importGeometryReport));
        }
    }

    private void throwsIfGeometryIsNotMatching(JdbcTemplate jdbcTemplate,
                                               ResourceQualifier sourceTable,
                                               String targetGeomType) {
        String sourceGeomTypeQuery = buildGetGeometryTypeQuery(sourceTable, "wkb_geometry");

        List<String> sourceGeomTypes = baseTemplateDao.queryForList(jdbcTemplate, sourceGeomTypeQuery, String.class);
        if (sourceGeomTypes.isEmpty()) {
            String msg = "В Shape файле отсутствуют объекты!";
            log.error(msg);

            throw new BadRequestException(msg);
        }

        String sourceGeomType = sourceGeomTypes.get(0);
        log.debug("Geometry type: source  {}, target {}", sourceGeomType, targetGeomType);

        if (!isGeometryTypeMatch(sourceGeomType, targetGeomType)) {
            String msg = "Тип импортируемой геометрии не совпадает с типом геометрии в слое!";
            log.error(msg);

            throw new BadRequestException(msg);
        }
    }
}
