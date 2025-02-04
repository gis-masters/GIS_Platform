package ru.mycrg.wrapper.service.import_;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.dto.ResourceProjection;
import ru.mycrg.data_service_contract.dto.import_.ImportMqResponse;
import ru.mycrg.data_service_contract.dto.import_.ImportMqTask;
import ru.mycrg.data_service_contract.queue.request.ImportRequestEvent;
import ru.mycrg.data_service_contract.queue.response.ImportResponseEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;
import ru.mycrg.wrapper.dao.CrgDaoGeometryHelper;
import ru.mycrg.wrapper.dao.DatasourceFactory;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.TASK_ERROR;

@Service
public class GeometryHandler extends AbstractImportChainItem {

    private final Logger log = LoggerFactory.getLogger(GeometryHandler.class);

    private final IMessageBusProducer messageBus;
    private final CrgDaoGeometryHelper geometryHelper;
    private final DatasourceFactory datasourceFactory;

    public GeometryHandler(CrgDaoGeometryHelper geometryHelper,
                           IMessageBusProducer messageBus,
                           DatasourceFactory datasourceFactory) {
        this.messageBus = messageBus;
        this.geometryHelper = geometryHelper;
        this.datasourceFactory = datasourceFactory;
    }

    public void handle(ImportRequestEvent event, ImportMqTask importTask) {
        log.debug("Validate / fix geometry");

        final ResourceProjection target = importTask.getTargetResource();
        try {
            String targetTableName = target.getTableName();
            String targetSchemaName = target.getSchemaName();

            String sourceDbName = importTask.getSourceResource().getDbName();
            JdbcTemplate jdbcTemplate = datasourceFactory.getJdbcTemplate(sourceDbName);

            int invalidFeatures = geometryHelper.countInvalid(jdbcTemplate, targetSchemaName, targetTableName);
            if (invalidFeatures > 0) {
                geometryHelper.makeValid(jdbcTemplate, targetSchemaName, targetTableName);
                geometryHelper.convertGeometryCollectionTo(jdbcTemplate, targetSchemaName, targetTableName,
                        importTask.getFeatureDescription().getGeometryType());
            }

            if (nextImporter != null) {
                nextImporter.handle(event, importTask);
            }
        } catch (Exception e) {
            String msg = String.format("Не удалось выполнить исправление геометрии для: %s", target.toString());

            log.error(msg, e);

            messageBus.produce(
                    new ImportResponseEvent(event, TASK_ERROR, "Error", msg, new ImportMqResponse(importTask)));

            rollback(importTask);
        }
    }
}
