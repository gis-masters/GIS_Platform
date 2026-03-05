package ru.mycrg.integration_service.bpmn.gpkg.export.vector;

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
        String gpkgPath = String.valueOf(delegateExecution.getVariable(EXPORT_GPKG_PATH_TO_GPKG));
        if (gpkgPath == null || gpkgPath.isBlank()) {
            log.error("Geo-wrapper не вернул путь к файлу.");

            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "geoWrapperError");

            return;
        }

        ExportGpkgEvent event = (ExportGpkgEvent) delegateExecution.getVariable(EXPORT_GPKG_EVENT);
        GpkgProcessContext rabbitDto = new GpkgProcessContext(event.getProcessId(),
                                                              event.getDbName(),
                                                              TASK_DONE);

        /*
         Мы тянем за собой ивент в котором есть что-то вроде ошибок и статусов.
         Но в нём нет детализации и опираться на него сложно.
         Поэтому пока что просто безусловно говорим что весь вектор done.
         Так же не удалось словить ошибок на этом шаге, разве что пробовать отключать БД например.
         Возможно стоит написать немного интеграционных SpringBootTest-ов с использованием WireMock или т.д.
         */
        reportManager.completeAllTablesInReport(rabbitDto, event.getGpkgReport(), gpkgPath);

        delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "geoWrapperDone");
    }
}
