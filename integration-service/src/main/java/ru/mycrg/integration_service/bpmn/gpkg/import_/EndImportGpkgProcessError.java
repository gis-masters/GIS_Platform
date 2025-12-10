package ru.mycrg.integration_service.bpmn.gpkg.import_;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgImportReport;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessStatus;
import ru.mycrg.data_service_contract.dto.PatchProcess;
import ru.mycrg.data_service_contract.queue.request.UpdateProcessEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgClearTemplatesEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.util.List;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.ERROR;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

@Service("endImportGpkgProcessError")
public class EndImportGpkgProcessError implements JavaDelegate {

    private static final Logger log = LoggerFactory.getLogger(EndImportGpkgProcessError.class);

    private final IMessageBusProducer messageBus;

    public EndImportGpkgProcessError(IMessageBusProducer messageBus) {
        this.messageBus = messageBus;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        log.debug("Класс {} начал работать.", EndImportGpkgProcessError.class.getSimpleName());
        ImportGpkgEvent event = (ImportGpkgEvent) delegateExecution.getVariable(EVENT_VAR_NAME);

        GpkgImportReport importReport = (GpkgImportReport) delegateExecution.getVariable(EVENT_IMPORT_GPKG_REPORT_NAME);
        String schema = "empty";

        String status = (String) delegateExecution.getVariable(CHECK_STATUS_VAR_NAME);
        String businessKey = (String) delegateExecution.getVariable(BUSINESS_KEY_VAR_NAME);

        switch (status) {
            case "noAccess":
                createReport(importReport, "Невозможно продолжать импорт. Ошибка при проверки прав на проект!");
                messageBus.produce(new ImportGpkgClearTemplatesEvent(event.getDbName(),
                                                                     schema,
                                                                     event.getFileId()));
                break;

            case "importFailed":
                createReport(importReport, "Невозможно продолжать импорт. Распаковка geoPackage завершилась ошибкой!");
                messageBus.produce(new ImportGpkgClearTemplatesEvent(event.getDbName(),
                                                                     schema,
                                                                     event.getFileId()));
            case "bigMistake":
                createReport(importReport,
                             "Невозможно продолжать импорт. Неожиданная ошибка при создании внутренних объектов!");
                schema = (String) delegateExecution.getVariable(EXTRACTED_SCHEMA_NAME);
                messageBus.produce(new ImportGpkgClearTemplatesEvent(event.getDbName(),
                                                                     schema,
                                                                     event.getFileId()));
            default:
                createReport(importReport,
                             "Невозможно продолжать импорт. Процесс не изменился спустя 5 минут!");
                messageBus.produce(new ImportGpkgClearTemplatesEvent(event.getDbName(),
                                                                     schema,
                                                                     event.getFileId()));
        }

        log.debug("importReport перед отправкой о завершении{}", importReport);
        PatchProcess newDetails = new PatchProcess(ERROR, importReport);
        messageBus.produce(new UpdateProcessEvent(event.getProcessId(),
                                                  businessKey,
                                                  event.getDbName(),
                                                  newDetails));
    }

    private static void createReport(GpkgImportReport importReport, String e) {
        importReport.setStatus(GpkgProcessStatus.ERROR);
        List<String> prev = importReport.getMessages();
        prev.add(e);
        importReport.setMessages(prev);
    }
}
