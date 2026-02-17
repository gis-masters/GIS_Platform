package ru.mycrg.integration_service.bpmn.gpkg.import_.main;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessReport;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgClearTemplatesEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgEvent;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgProcessContext;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgReportManager;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import static ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessStatus.COMPLETED;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.DONE;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

/**
 * Класс для импорта GPKG. (Последний в цепочке)
 *
 * <h3>Репорт на этом этапе:</h3>
 * <ul>
 *   <li>Количество и состав таблиц которые внутри gpkg</li>
 *   <li>Есть описание сущности "Проект"</li>
 *   <li>Есть репорт после всех тиков процесса</li>
 *
 *   <li>Нужно понять общий статус процесса, наполнить детали чем то типа "ошибок не было" и пушнуть</li>
 * </ul>
 */

@Service("endImportGpkgProcessDone")
public class EndImportGpkgProcessDone implements JavaDelegate {

    private static final Logger log = LoggerFactory.getLogger(EndImportGpkgProcessDone.class);

    private final IMessageBusProducer messageBus;
    private final GpkgReportManager reportManager;

    public EndImportGpkgProcessDone(IMessageBusProducer messageBus, GpkgReportManager reportManager) {
        this.messageBus = messageBus;
        this.reportManager = reportManager;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        log.debug("Класс {} начал работать.", EndImportGpkgProcessDone.class.getSimpleName());

        ImportGpkgEvent event = (ImportGpkgEvent) delegateExecution.getVariable(IMPORT_GPKG_EVENT);
        GpkgProcessReport importReport = (GpkgProcessReport) delegateExecution.getVariable(
                IMPORT_GPKG_EVENT_REPORT);

        String schema = (String) delegateExecution.getVariable(IMPORT_GPKG_EXTRACTED_SCHEMA_NAME);
        messageBus.produce(new ImportGpkgClearTemplatesEvent(event.getDbName(),
                                                             schema,
                                                             event.getFileId()));

        GpkgProcessContext rabbitDto = new GpkgProcessContext(event.getProcessId(),
                                                              event.getDbName(),
                                                              DONE);

        reportManager.finalizeReport(rabbitDto, importReport, COMPLETED, "Импорт успешно завершён.");
    }
}
