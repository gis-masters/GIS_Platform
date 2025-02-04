package ru.mycrg.wrapper.service.import_;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.dto.ResourceProjection;
import ru.mycrg.data_service_contract.dto.import_.ImportMqTask;
import ru.mycrg.data_service_contract.queue.request.ImportRequestEvent;
import ru.mycrg.geoserver_client.services.feature_types.FeatureTypeService;
import ru.mycrg.geoserver_client.services.layers.VectorLayer;
import ru.mycrg.http_client.exceptions.HttpClientException;
import ru.mycrg.wrapper.dao.BaseDaoService;
import ru.mycrg.wrapper.dao.DatasourceFactory;

import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultStoreName;

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
    public void handle(ImportRequestEvent event, ImportMqTask importTask) {
        log.debug("Try cleanUp after import");

        String dbName = importTask.getSourceResource().getDbName();
        String sourceTableName = importTask.getSourceResource().getTableName();
        String sourceSchemaName = importTask.getSourceResource().getSchemaName();
        try {
            JdbcTemplate jdbcTemplate = datasourceFactory.getJdbcTemplate(dbName);

            ResourceProjection sourceResource = new ResourceProjection(dbName, sourceSchemaName, sourceTableName);

            baseDaoService.delete(jdbcTemplate, sourceResource.getSchemaName(), sourceResource.getTableName());
        } catch (Exception e) {
            log.error("Ошибка при попытке удалить черновую таблицу из БД после импорта: {}", e.getMessage(), e);
        }

        try {
            final String workspaceName = importTask.getWorkspaceName();
            final String dataStoreName = getDefaultStoreName(workspaceName);

            new VectorLayer(importTask.getRootToken()).delete(workspaceName, sourceTableName);
            new FeatureTypeService(importTask.getRootToken()).delete(workspaceName, dataStoreName, sourceTableName);
        } catch (HttpClientException e) {
            log.warn("Cant cleanUp geoserver featureTypes");
        }
    }
}
