package ru.mycrg.wrapper.service.import_;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common.import_.ImportMqTask;
import ru.mycrg.wrapper.geoserver_client.exceptions.GeoserverClientException;
import ru.mycrg.wrapper.geoserver_client.services.feature_types.FeatureTypeService;

import static ru.mycrg.common.CrgConstants.DEFAULT_STORE_POSTFIX;

@Service
public class GeoserverImportService implements CrgImporter {

    private static final Logger log = LoggerFactory.getLogger(GeoserverImportService.class);

    private CrgImporter nextImporter;
    private CrgImporter previousImporter;

    private final FeatureTypeService featureTypesService;

    public GeoserverImportService(FeatureTypeService featureTypesService) {
        this.featureTypesService = featureTypesService;
    }

    @Override
    public void setHandlers(CrgImporter nextImporter, CrgImporter previousImporter) {
        this.nextImporter = nextImporter;
        this.previousImporter = previousImporter;
    }

    public void doImport(ImportMqTask importTask) {
        log.debug("Publish feature on geoserver");

        try {
            featureTypesService.create(
                    importTask.getTargetResource().getSchemaName(),
                    importTask.getTargetResource().getDbName() + DEFAULT_STORE_POSTFIX,
                    importTask.getFeatureDescription().getName(),
                    importTask.getUserToken());

            log.debug("Import chain successful end");
        } catch (GeoserverClientException e) {
            previousImporter.rollback(importTask);
        }
    }

    @Override
    public void rollback(ImportMqTask importTask) {
        previousImporter.rollback(importTask);
    }

}
