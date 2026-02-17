package ru.mycrg.integration_service.bpmn.gpkg.import_.main;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessReport;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessStatus;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgClearTemplatesEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgEvent;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgProcessContext;
import ru.mycrg.integration_service.bpmn.enums.GpkgImportProcessPermittedStatus;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgReportManager;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.util.List;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.ERROR;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;
import static ru.mycrg.integration_service.bpmn.enums.GpkgImportProcessPermittedStatus.stringToValue;

@Service("endImportGpkgProcessError")
public class EndImportGpkgProcessError implements JavaDelegate {

    private static final Logger log = LoggerFactory.getLogger(EndImportGpkgProcessError.class);

    private final IMessageBusProducer messageBus;
    private final GpkgReportManager reportManager;

    public EndImportGpkgProcessError(IMessageBusProducer messageBus, GpkgReportManager reportManager) {
        this.messageBus = messageBus;
        this.reportManager = reportManager;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        log.debug("Класс {} начал работать.", EndImportGpkgProcessError.class.getSimpleName());
        ImportGpkgEvent event = (ImportGpkgEvent) delegateExecution.getVariable(IMPORT_GPKG_EVENT);

        GpkgProcessReport importReport = (GpkgProcessReport) delegateExecution.getVariable(
                IMPORT_GPKG_EVENT_REPORT);
        String schema = "empty";

        String statusString = (String) delegateExecution.getVariable(CHECK_STATUS_VAR_NAME);
        GpkgImportProcessPermittedStatus status = stringToValue(statusString);

        switch (status) {
            case NO_ACCESS_TO_PROJECT:
                createReport(importReport, "Невозможно продолжать импорт. Ошибка при проверки прав на проект!");
                messageBus.produce(new ImportGpkgClearTemplatesEvent(event.getDbName(),
                                                                     schema,
                                                                     event.getFileId()));
                break;

            case GDAL_IMPORT_VECTOR_FAILED:
                createReport(importReport, "Невозможно продолжать импорт. Распаковка geoPackage завершилась ошибкой!");
                messageBus.produce(new ImportGpkgClearTemplatesEvent(event.getDbName(),
                                                                     schema,
                                                                     event.getFileId()));
                break;
            default:
                createReport(importReport,
                             "Невозможно продолжать импорт. Процесс не изменился спустя 5 минут!");
                messageBus.produce(new ImportGpkgClearTemplatesEvent(event.getDbName(),
                                                                     schema,
                                                                     event.getFileId()));
        }

        log.debug("importReport перед отправкой о завершении{}", importReport);
        GpkgProcessContext rabbitDto = new GpkgProcessContext(event.getProcessId(),
                                                              event.getDbName(),
                                                              ERROR);

        reportManager.finalizeReport(rabbitDto, importReport, GpkgProcessStatus.ERROR, "Импорт завершён c ошибкой!!!");
    }

    private static void createReport(GpkgProcessReport importReport, String e) {
        importReport.setStatus(GpkgProcessStatus.ERROR);
        List<String> prev = importReport.getMessages();
        prev.add(e);
        importReport.setMessages(prev);
    }
}
