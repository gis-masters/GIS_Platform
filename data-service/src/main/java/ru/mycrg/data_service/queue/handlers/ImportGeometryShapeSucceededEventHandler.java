package ru.mycrg.data_service.queue.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.exceptions.ClientException;
import ru.mycrg.data_service.dao.core.CoreTemplateDao;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.data_service.service.processes.ProcessService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.util.JsonConverter;
import ru.mycrg.data_service_contract.dto.ErrorReport;
import ru.mycrg.data_service_contract.dto.ImportGeometryShapeReport;
import ru.mycrg.data_service_contract.queue.request.ShapeLoadedEvent;
import ru.mycrg.data_service_contract.queue.response.ShapeImportedSucceededEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import java.util.List;

import static ru.mycrg.data_service.dao.config.DatasourceFactory.INITIAL_SCHEMA_NAME;
import static ru.mycrg.data_service.dao.utils.SqlBuilder.*;
import static ru.mycrg.data_service.util.GeometryHandler.isGeometryTypeMatch;

@Service
public class ImportGeometryShapeSucceededEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(ImportGeometryShapeSucceededEventHandler.class);

    private final ProcessService processService;
    private final DatasourceFactory datasourceFactory;
    private final CoreTemplateDao coreTemplateDao;

    public ImportGeometryShapeSucceededEventHandler(ProcessService processService,
                                                    DatasourceFactory datasourceFactory,
                                                    CoreTemplateDao coreTemplateDao) {
        this.processService = processService;
        this.datasourceFactory = datasourceFactory;
        this.coreTemplateDao = coreTemplateDao;
    }

    @Override
    public String getEventType() {
        return ShapeImportedSucceededEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        ShapeImportedSucceededEvent event = (ShapeImportedSucceededEvent) mqEvent;
        ShapeLoadedEvent requestEvent = event.getImportGeometryShapeEvent();
        ErrorReport errorReport = event.getErrorReport();
        ImportGeometryShapeReport importGeometryReport = new ImportGeometryShapeReport();

        log.debug("In ShapeImportedSucceededEvent! {}", requestEvent);

        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getDataSource(requestEvent.getDbName()));

        ResourceQualifier sourceTable = new ResourceQualifier(INITIAL_SCHEMA_NAME,
                                                              requestEvent.getSourceTableName());
        ResourceQualifier targetTable = new ResourceQualifier(requestEvent.getDatasetId(),
                                                              requestEvent.getTargetTableName());

        try {
            importGeometryReport.setDatasetIdentifier(targetTable.getSchema());
            importGeometryReport.setTableIdentifier(targetTable.getTableQualifier());

            throwsIfGeometryIsNotMatching(jdbcTemplate, sourceTable, requestEvent.getGeometryType());

            String copyQuery = buildCopyGeometryQuery(sourceTable, targetTable);
            Long insertedQuantity = coreTemplateDao.queryForObject(jdbcTemplate, copyQuery, Long.class);

            importGeometryReport.setSuccess(true);
            importGeometryReport.setQuantityOfImportedRecords(insertedQuantity);
            importGeometryReport.setQuantityOfFailedRecords(errorReport.getFailedRecordCount());
            importGeometryReport.setShapeFileHasProjection(errorReport.isShpFileHasProjection());
            importGeometryReport.setTargetCrs(requestEvent.getSrs());

            processService.complete(requestEvent.getDbName(),
                                    requestEvent.getProcessId(),
                                    JsonConverter.toJsonNode(importGeometryReport));

            log.debug("Процесс успешно завершен");
        } catch (ClientException e) {
            String msg = "Не удалось заимпортировать геометрию. Причина: " + e.getMessage();
            log.error("Не удалось корректно обработать ShapeImportedSucceededEvent. {}", msg);

            importGeometryReport.setSuccess(false);
            importGeometryReport.setQuantityOfImportedRecords(0L);
            importGeometryReport.setWarningMessage(msg);

            processService.error(requestEvent.getDbName(),
                                 requestEvent.getProcessId(),
                                 JsonConverter.toJsonNode(importGeometryReport));
        } catch (Exception e) {
            String msg = "Не удалось заимпортировать геометрию. Причина: " + e.getMessage();
            log.error("Не удалось корректно обработать ShapeImportedSucceededEvent. {}", msg);

            importGeometryReport.setSuccess(false);
            importGeometryReport.setQuantityOfImportedRecords(0L);
            importGeometryReport.setErrorMessage(msg);

            processService.error(requestEvent.getDbName(),
                                 requestEvent.getProcessId(),
                                 JsonConverter.toJsonNode(importGeometryReport));
        }

        String deleteTableQuery = buildDeleteTableQuery(sourceTable);
        log.debug("SQL Delete temporary table Query: {}", deleteTableQuery);
        coreTemplateDao.execute(jdbcTemplate, deleteTableQuery);
        log.debug("Временная таблица {} удалена.", sourceTable.getQualifier());
    }

    private void throwsIfGeometryIsNotMatching(JdbcTemplate jdbcTemplate,
                                               ResourceQualifier sourceTable,
                                               String targetGeomType) {
        List<String> sourceGeomTypes;

        try {
            String sourceGeomTypeQuery = buildGetGeometryTypeQuery(sourceTable, "wkb_geometry");
            log.debug("SQL get geometry type of table: {}", sourceGeomTypeQuery);
            sourceGeomTypes = coreTemplateDao.queryForList(jdbcTemplate, sourceGeomTypeQuery, String.class);
        } catch (Exception e) {
            String msg = "Не удалось вычислить тип геометрии в таблице: " + sourceTable.getQualifier();
            log.error("{}. Причина: {}", msg, e.getMessage());

            throw new ClientException(msg);
        }

        if (sourceGeomTypes.isEmpty()) {
            String msg = "В Shape файле отсутствуют объекты!";
            log.error(msg);

            throw new ClientException(msg);
        }

        String sourceGeomType = sourceGeomTypes.get(0);
        log.debug("Geometry type: source  {}, target {}", sourceGeomType, targetGeomType);

        if (!isGeometryTypeMatch(sourceGeomType, targetGeomType)) {
            String msg = String.format("Тип импортируемой геометрии не совпадает с типом геометрии в слое! " +
                                               "Исходный тип геометрии: %s, тип геометрии в слое: %s",
                                       sourceGeomType, targetGeomType);
            log.error(msg);

            throw new ClientException(msg);
        }
    }
}
