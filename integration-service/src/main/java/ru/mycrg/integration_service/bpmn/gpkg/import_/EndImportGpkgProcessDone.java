package ru.mycrg.integration_service.bpmn.gpkg.import_;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgImportDestinationProject;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgImportReport;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgPayloadData;
import ru.mycrg.data_service_contract.dto.PatchProcess;
import ru.mycrg.data_service_contract.queue.request.UpdateProcessEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgClearTemplatesEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.util.List;

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

    public EndImportGpkgProcessDone(IMessageBusProducer messageBus) {
        this.messageBus = messageBus;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        log.debug("Класс {} начал работать.", EndImportGpkgProcessDone.class.getSimpleName());

        ImportGpkgEvent event = (ImportGpkgEvent) delegateExecution.getVariable(EVENT_VAR_NAME);
        GpkgImportReport importReport = (GpkgImportReport) delegateExecution.getVariable(EVENT_IMPORT_GPKG_REPORT_NAME);
        String businessKey = (String) delegateExecution.getVariable(BUSINESS_KEY_VAR_NAME);

        GpkgPayloadData payload = importReport.getPayload();
        GpkgImportDestinationProject project = payload.getProject();
        project.setStatus(COMPLETED);
        payload.setProject(project);
        importReport.setPayload(payload);

        importReport.setStatus(COMPLETED);
        List<String> messages = importReport.getMessages();
        messages.add("Импорт успешно завершён.");
        importReport.setMessages(messages);

        String schema = (String) delegateExecution.getVariable(EXTRACTED_SCHEMA_NAME);
        messageBus.produce(new ImportGpkgClearTemplatesEvent(event.getDbName(),
                                                             schema,
                                                             event.getFileId()));


        PatchProcess newDetails = new PatchProcess(DONE, importReport);
        messageBus.produce(new UpdateProcessEvent(event.getProcessId(),
                                                  businessKey,
                                                  event.getDbName(),
                                                  newDetails));
    }
}
