package ru.mycrg.integration_service.bpmn.gpkg.export;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.queue.request.gpkg.ExportGpkgEvent;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgProcessContext;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgReportManager;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.TASK_DONE;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

@Service("updateTableReport")
public class UpdateTableReport implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(UpdateTableReport.class);

    private final GpkgReportManager reportManager;

    public UpdateTableReport(GpkgReportManager reportManager) {
        this.reportManager = reportManager;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        String gpkgPath = String.valueOf(delegateExecution.getVariable(GPKG_PATH_VAR_NAME));
        if (gpkgPath == null || gpkgPath.isBlank()) {
            log.error("Geo-wrapper не вернул путь к файлу.");

            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "geoWrapperError");

            return;
        }

        ExportGpkgEvent event = (ExportGpkgEvent) delegateExecution.getVariable(EVENT_VAR_NAME);
        GpkgProcessContext rabbitDto = new GpkgProcessContext(event.getProcessId(),
                                                              event.getDbName(),
                                                              TASK_DONE);

        reportManager.completeAllTablesInReport(rabbitDto, event.getGpkgReport(), gpkgPath);

        delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "geoWrapperDone");
    }
}
