package ru.mycrg.wrapper.service.import_;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.mq_queue_contract.BaseMqProcessRequest;
import ru.mycrg.mq_queue_contract.BaseMqProcessResponse;
import ru.mycrg.mq_queue_contract.import_.ImportMqResponse;
import ru.mycrg.mq_queue_contract.import_.ImportMqTask;
import ru.mycrg.wrapper.dao.CrgDaoGeometryHelper;
import ru.mycrg.wrapper.dao.DatasourceFactory;
import ru.mycrg.wrapper.queue.MqSender;

import static ru.mycrg.mq_queue_contract.enums.ProcessStatus.*;

@Service
public class GeometryHandler extends AbstractImportChainItem {

    private static final Logger log = LoggerFactory.getLogger(GeometryHandler.class);

    private final MqSender mqSender;
    private final CrgDaoGeometryHelper geometryHelper;
    private final DatasourceFactory datasourceFactory;

    public GeometryHandler(CrgDaoGeometryHelper geometryHelper,
                           MqSender mqSender,
                           DatasourceFactory datasourceFactory) {
        this.mqSender = mqSender;
        this.geometryHelper = geometryHelper;
        this.datasourceFactory = datasourceFactory;
    }

    public void handle(BaseMqProcessRequest mqRequest, ImportMqTask importTask) {
        log.debug("Validate / fix geometry");

        try {
            String targetTableName = importTask.getTargetResource().getTableName();
            String targetSchemaName = importTask.getTargetResource().getSchemaName();

            String sourceDbName = importTask.getSourceResource().getDbName();
            JdbcTemplate jdbcTemplate = datasourceFactory.getJdbcTemplate(sourceDbName);

            int invalidFeatures = geometryHelper.countInvalid(jdbcTemplate, targetSchemaName, targetTableName);
            if (invalidFeatures > 0) {
                geometryHelper.makeValid(jdbcTemplate, targetSchemaName, targetTableName);
            }

            if (nextImporter != null) {
                nextImporter.handle(mqRequest, importTask);
            }
        } catch (Exception e) {
            String msg = String.format("Не удалось выполнить исправление геометрии для: %s в: %s",
                    importTask.printSource(),
                    importTask.printTarget());

            log.error(msg, e);

            mqSender.send(
                    new BaseMqProcessResponse(mqRequest,
                            new ImportMqResponse(importTask), TASK_ERROR, "Error", msg));

            rollback(importTask);
        }
    }
}
