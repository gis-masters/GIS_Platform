package ru.mycrg.integration_service.bpmn.gpkg.export.raster;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.dto.BuildGpkgRastersBackwardEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.ExportGpkgEvent;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgProcessContext;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgReportManager;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.ERROR;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.TASK_DONE;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

@Service("saveRastersReportAfterGdal")
public class SaveRastersReportAfterGdal implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(SaveRastersReportAfterGdal.class);

    private final GpkgReportManager reportManager;

    public SaveRastersReportAfterGdal(GpkgReportManager reportManager) {
        this.reportManager = reportManager;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        BuildGpkgRastersBackwardEvent backwardEvent = (BuildGpkgRastersBackwardEvent) delegateExecution
                .getVariable(EXPORT_GPKG_BACKWARD_RASTERS_EVENT);

        if (backwardEvent.getStatus() == ERROR) {
            log.warn("Работы по сохранению tiff как gpkg завершились с неожиданной ошибкой.");
            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "rasterGdalWorkFail");

            return;
        }

        //актуализируем путь для последующего добавления в отчёт
        delegateExecution.setVariable(EXPORT_GPKG_PATH_TO_GPKG, backwardEvent.getEvent().getPath());

        ExportGpkgEvent event = (ExportGpkgEvent) delegateExecution.getVariable(EXPORT_GPKG_EVENT);
        GpkgProcessContext rabbitDto = new GpkgProcessContext(event.getProcessId(),
                                                              event.getDbName(),
                                                              TASK_DONE);

        reportManager.mergeGdalTilesReport(rabbitDto, event.getGpkgReport(), backwardEvent.getReport());

        log.debug("Растры успешно добавлены к gpkg -> пробуем донести дополнительную информацию");
        delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "rasterGdalWorkDone");
    }
}
