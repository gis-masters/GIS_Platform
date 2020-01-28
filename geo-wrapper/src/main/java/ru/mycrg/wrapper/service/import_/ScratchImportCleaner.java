package ru.mycrg.wrapper.service.import_;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.mq_queue_contract.BaseMqProcessRequest;
import ru.mycrg.mq_queue_contract.ResourceProjection;
import ru.mycrg.mq_queue_contract.import_.ImportMqTask;
import ru.mycrg.wrapper.dao.BaseDaoService;
import ru.mycrg.wrapper.dao.DatasourceFactory;

@Service
public class ScratchImportCleaner extends AbstractImportChainItem {

    private static final Logger log = LoggerFactory.getLogger(ScratchImportCleaner.class);

    private final BaseDaoService baseDaoService;
    private final DatasourceFactory datasourceFactory;

    public ScratchImportCleaner(BaseDaoService baseDaoService,
                                DatasourceFactory datasourceFactory) {
        this.baseDaoService = baseDaoService;
        this.datasourceFactory = datasourceFactory;
    }

    @Override
    public void handle(BaseMqProcessRequest mqRequest, ImportMqTask importTask) {
        log.debug("Try cleanUp after import");

        try {
            String dbName = importTask.getSourceResource().getDbName();
            String sourceTableName = importTask.getSourceResource().getTableName();
            String sourceSchemaName = importTask.getSourceResource().getSchemaName();
            JdbcTemplate jdbcTemplate = datasourceFactory.getJdbcTemplate(dbName);

            ResourceProjection sourceResource = new ResourceProjection(dbName, sourceSchemaName, sourceTableName);

            baseDaoService.delete(jdbcTemplate, sourceResource);
        } catch (Exception e) {
            log.error("Ошибка при попытке удалить черновую таблицу из БД после импорта: {}", e.getMessage(), e);
        }
    }

}
