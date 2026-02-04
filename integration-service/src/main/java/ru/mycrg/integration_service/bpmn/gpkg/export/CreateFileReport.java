package ru.mycrg.integration_service.bpmn.gpkg.export;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgFile;
import ru.mycrg.data_service_contract.queue.request.gpkg.ExportGpkgEvent;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgReportManager;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgProcessContext;

import java.util.List;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.TASK_DONE;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

@Service("createFileReport")
public class CreateFileReport implements JavaDelegate {

    private static final Logger log = LoggerFactory.getLogger(CreateFileReport.class);

    private final GpkgReportManager reportManager;

    public CreateFileReport(GpkgReportManager reportManager) {
        this.reportManager = reportManager;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        List<GpkgFile> exportedFile =
                (List<GpkgFile>) delegateExecution.getVariable(FEATURES_FILES_LIST_VAR_NAME);

        ExportGpkgEvent event = (ExportGpkgEvent) delegateExecution.getVariable(EVENT_VAR_NAME);
        GpkgProcessContext rabbitDto = new GpkgProcessContext(event.getProcessId(),
                                                              event.getDbName(),
                                                              TASK_DONE);

        //Отчёт на самом деле формирует data-service. Мы просто добавляем его к основному телу отчёта.
        reportManager.createFileReport(rabbitDto, event.getGpkgReport(), exportedFile);

        log.debug("Насытили отчёт экспорта GPKG информацией о файлах.");
    }
}
