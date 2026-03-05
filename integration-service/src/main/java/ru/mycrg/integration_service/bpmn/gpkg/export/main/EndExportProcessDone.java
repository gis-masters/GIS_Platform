package ru.mycrg.integration_service.bpmn.gpkg.export.main;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessReport;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessStatus;
import ru.mycrg.data_service_contract.queue.request.gpkg.ExportGpkgEvent;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgProcessContext;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgReportManager;

import java.util.Collections;
import java.util.Optional;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.DONE;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.EXPORT_GPKG_EVENT;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.EXPORT_GPKG_PATH_TO_GPKG;

@Service("endExportProcessDone")
public class EndExportProcessDone implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(EndExportProcessDone.class);

    private final GpkgReportManager reportManager;

    public EndExportProcessDone(GpkgReportManager reportManager) {
        this.reportManager = reportManager;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        log.debug("Класс '{}' начал работу.", EndExportProcessDone.class.getSimpleName());
        ExportGpkgEvent event = (ExportGpkgEvent) delegateExecution.getVariable(EXPORT_GPKG_EVENT);
        GpkgProcessContext rabbitDto = new GpkgProcessContext(event.getProcessId(),
                                                              event.getDbName(),
                                                              DONE);

        String errMsg = "Непредвиденная ошибка формирования отчёта";

        try {
            String pathToGpkg = (String) delegateExecution.getVariable(EXPORT_GPKG_PATH_TO_GPKG);

            Optional.ofNullable(event.getGpkgReport())
                    .ifPresentOrElse(report -> report.setFilePath(pathToGpkg),
                                     () -> {
                                         log.warn(errMsg);

                                         event.setGpkgReport(new GpkgProcessReport(pathToGpkg));
                                         event.getGpkgReport().setMessages(Collections.singletonList(errMsg));
                                     });

            reportManager.finalizeReport(rabbitDto,
                                         event.getGpkgReport(),
                                         GpkgProcessStatus.COMPLETED,
                                         "Процесс выгрузки GPKG завершён.");

            log.debug("Успех! Выгрузка GPKG завершена!");
        } catch (Exception e) {
            log.error(errMsg);

            reportManager.finalizeReport(rabbitDto,
                                         new GpkgProcessReport(),
                                         GpkgProcessStatus.COMPLETED,
                                         "Процесс выгрузки GPKG завершён.");
        }
    }
}
