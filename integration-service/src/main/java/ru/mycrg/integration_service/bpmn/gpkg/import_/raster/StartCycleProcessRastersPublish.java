package ru.mycrg.integration_service.bpmn.gpkg.import_.raster;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgTile;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessReport;
import ru.mycrg.data_service_contract.dto.publication.BaseWsProcess;
import ru.mycrg.data_service_contract.dto.publication.GeoserverPublicationData;
import ru.mycrg.data_service_contract.dto.publication.GisPublicationData;
import ru.mycrg.data_service_contract.queue.request.FilePublicationEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgEvent;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgProcessContext;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgReportManager;
import ru.mycrg.integration_service.service.DataServiceSpeaker;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static ru.mycrg.common_utils.CrgGlobalProperties.*;
import static ru.mycrg.data_service_contract.enums.FilePublicationMode.FULL;
import static ru.mycrg.data_service_contract.enums.FileType.TIF;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.TASK_DONE;
import static ru.mycrg.integration_service.bpmn.CamundaVariables.asJava;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;
import static ru.mycrg.integration_service.bpmn.enums.GpkgImportProcessPermittedStatus.ALL_RASTERS_IS_PUBLISHED;
import static ru.mycrg.integration_service.bpmn.enums.GpkgImportProcessPermittedStatus.NEED_PUBLISH_ONE_MORE_RASTER;

@Service("startCycleProcessRastersPublish")
public class StartCycleProcessRastersPublish implements JavaDelegate {

    private static final Logger log = LoggerFactory.getLogger(StartCycleProcessRastersPublish.class);

    private final DataServiceSpeaker dataServiceSpeaker;
    private final GpkgReportManager reportManager;

    public StartCycleProcessRastersPublish(DataServiceSpeaker dataServiceSpeaker, GpkgReportManager reportManager) {
        this.dataServiceSpeaker = dataServiceSpeaker;
        this.reportManager = reportManager;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        int neededCyclesCount = (int) delegateExecution.getVariable(IMPORT_GPKG_NEEDED_RASTER_PUBLISH_CYCLES_COUNT);
        int performedCyclesCount = (int) delegateExecution.getVariable(
                IMPORT_GPKG_PERFORMED_RASTER_PUBLISH_CYCLES_COUNT);
        List<GpkgTile> extractedData = (List<GpkgTile>) delegateExecution.getVariable(IMPORT_GPKG_GDAL_RASTERS_LIST);

        if (neededCyclesCount == 0 && performedCyclesCount == 0) {
            log.debug("Мы первый раз в шаге публикации растров. Нужно посчитать количество циклов");

            if (extractedData == null || extractedData.isEmpty()) {
                log.warn("Нет растров для публикации");
                delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, ALL_RASTERS_IS_PUBLISHED.getValue());

                return;
            }

            log.debug("Инициализация процесса публикации растров. Всего растров: {}", extractedData.size());
            delegateExecution.setVariable(IMPORT_GPKG_NEEDED_RASTER_PUBLISH_CYCLES_COUNT, extractedData.size());
            delegateExecution.setVariable(IMPORT_GPKG_PERFORMED_RASTER_PUBLISH_CYCLES_COUNT, 1);
            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, NEED_PUBLISH_ONE_MORE_RASTER.getValue());

            GpkgTile currentTile = extractedData.get(performedCyclesCount);
            log.debug("Публикация растра 1/{}: {}", extractedData.size(),
                      currentTile.getGpkgLayerTableName());
            publishRaster(delegateExecution, currentTile);

            return;
        }

        if (performedCyclesCount >= neededCyclesCount) {
            log.debug("Все растры опубликованы. Всего: {}", performedCyclesCount);
            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, ALL_RASTERS_IS_PUBLISHED.getValue());

            return;
        }

        GpkgTile currentTile = extractedData.get(performedCyclesCount);
        log.debug("Публикация растра {}/{}: {}", performedCyclesCount + 1, neededCyclesCount,
                  currentTile.getGpkgLayerTableName());

        delegateExecution.setVariable(IMPORT_GPKG_PERFORMED_RASTER_PUBLISH_CYCLES_COUNT, performedCyclesCount + 1);
        delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, NEED_PUBLISH_ONE_MORE_RASTER.getValue());

        publishRaster(delegateExecution, currentTile);
    }

    private void publishRaster(DelegateExecution delegateExecution, GpkgTile currentTile) {
        delegateExecution.setVariable(IMPORT_GPKG_CURRENT_TILE, asJava(currentTile));

        ImportGpkgEvent event = (ImportGpkgEvent) delegateExecution.getVariable(IMPORT_GPKG_EVENT);
        String fileQ = currentTile.getLibraryIdentifier() + "_" + currentTile.getDocumentId() + "_" +
                currentTile.getField();

        String featureTypeName = buildFeatureTypeName(currentTile.getLibraryIdentifier(),
                                                      currentTile.getDocumentId(),
                                                      UUID.fromString(currentTile.getTitle()));

        String nativeName = String.valueOf(UUID.randomUUID());

        String filePath = dataServiceSpeaker.getFilePathById(event.getToken(), currentTile.getTitle());
        log.debug("Путь созданного файла {}", filePath);

        long layerGroupId = (long) delegateExecution.getVariable(IMPORT_GPKG_CREATED_LAYER_GROUP_ID);

        GpkgProcessContext rabbitDto = new GpkgProcessContext(event.getProcessId(),
                                                              event.getDbName(),
                                                              TASK_DONE);
        GpkgProcessReport importReport = (GpkgProcessReport) delegateExecution.getVariable(IMPORT_GPKG_EVENT_REPORT);
        reportManager.createLayerReport(rabbitDto, importReport, currentTile);

        Optional<Long> oExtractedId = extractIdFromDbName(event.getDbName());

        if (oExtractedId.isPresent()) {
            FilePublicationEvent filePublicationEvent = new FilePublicationEvent(
                    TIF,
                    FULL,
                    new BaseWsProcess(event.getToken()),
                    new GeoserverPublicationData(
                            getScratchWorkspaceName(oExtractedId.get()),
                            buildStoreName(oExtractedId.get(),
                                           "tif",
                                           nativeName,
                                           fileQ),
                            featureTypeName,
                            nativeName),
                    new GisPublicationData(
                            event.getProjectId(),
                            layerGroupId,
                            currentTile.getLibraryIdentifier(),
                            "document",
                            currentTile.getDocumentId(),
                            currentTile.getGpkgLayerTableName(),
                            filePath,
                            "raster",
                            currentTile.getSrs())
            );

            delegateExecution.setVariable(IMPORT_GPKG_CURRENT_PUBLISH_RASTER, asJava(filePublicationEvent));
        } else {
            log.warn("Не удалось вычислить Id организации из строки {}", event.getDbName());
            delegateExecution.setVariable(IMPORT_GPKG_CURRENT_PUBLISH_RASTER, asJava(new FilePublicationEvent()));
        }
    }
}
