package ru.mycrg.integration_service.bpmn.gpkg.import_.raster;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.GpkgTile;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessReport;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessStatus;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgEvent;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgProcessContext;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgReportManager;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.TASK_DONE;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

@Service("layerReportAfterPublish")
public class LayerReportAfterPublish implements JavaDelegate {

    private static final Logger log = LoggerFactory.getLogger(LayerReportAfterPublish.class);

    private final GpkgReportManager reportManager;

    public LayerReportAfterPublish(GpkgReportManager reportManager) {
        this.reportManager = reportManager;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        ImportGpkgEvent event = (ImportGpkgEvent) delegateExecution.getVariable(IMPORT_GPKG_EVENT);
        GpkgProcessContext rabbitDto = new GpkgProcessContext(event.getProcessId(),
                                                              event.getDbName(),
                                                              TASK_DONE);

        GpkgTile currentTile = (GpkgTile) delegateExecution.getVariable(IMPORT_GPKG_CURRENT_TILE);
        GpkgProcessReport importReport = (GpkgProcessReport) delegateExecution.getVariable(IMPORT_GPKG_EVENT_REPORT);

        String theWay = (String) delegateExecution.getVariable("theWay");
        boolean cameFromError = "badWay".equals(theWay);

        if (cameFromError) {
            String failReason = extractFailReason(delegateExecution);
            updateReportWithError(rabbitDto, importReport, currentTile, failReason);

            return;
        }

        boolean isRasterPublished = (boolean) delegateExecution.getVariable(IMPORT_GPKG_PUBLISH_RASTER_STATUS);
        int gisServiceCode = (int) delegateExecution.getVariable(PREV_STEP_STATUS);

        if (gisServiceCode == 204) {
            updateReportWithError(rabbitDto, importReport, currentTile, "Слой не был создан в проекте!!!");

            return;
        }

        if (isRasterPublished) {
            reportManager.updateLayerReportByTitle(rabbitDto, importReport,
                                                   currentTile.getTitle(),
                                                   GpkgProcessStatus.COMPLETED,
                                                   "Публикация растра завершена успешно");
        } else {
            String failReason = extractFailReason(delegateExecution);
            updateReportWithError(rabbitDto, importReport, currentTile, failReason);
        }
    }

    private String extractFailReason(DelegateExecution delegateExecution) {
        try {
            return (String) delegateExecution.getVariable(FAIL_REASON);
        } catch (Exception e) {
            String errorMessage = "Публикация растра в проекте завершилась с непредвиденной ошибкой: " + e.getMessage();
            log.warn(errorMessage, e);

            return errorMessage;
        }
    }

    private void updateReportWithError(GpkgProcessContext rabbitDto, GpkgProcessReport importReport,
                                       GpkgTile currentTile, String failReason) {
        reportManager.updateLayerReportByTitle(rabbitDto, importReport,
                                               currentTile.getTitle(),
                                               GpkgProcessStatus.ERROR,
                                               failReason);
    }
}
