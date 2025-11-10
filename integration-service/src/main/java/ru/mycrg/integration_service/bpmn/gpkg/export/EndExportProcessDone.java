package ru.mycrg.integration_service.bpmn.gpkg.export;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.gpkg.GkpgExportDetailsModel;
import ru.mycrg.common_contracts.generated.gpkg.MessageFromExport;
import ru.mycrg.data_service_contract.dto.PatchProcess;
import ru.mycrg.data_service_contract.queue.request.gpkg.ExportGpkgEvent;
import ru.mycrg.data_service_contract.queue.request.UpdateProcessEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.util.List;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.DONE;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

/**
 * В рамках BPMN экспорта GPKG завершаем основной процесс. (последний в цепочке)
 *
 * <p>Реализован.</p>
 *
 * <h3>Поведение:</h3>
 * <ul>
 *   <li>Отправляем DONE в процесс.</li>
 * </ul>
 *
 * <h3>Планируемые доработки:</h3>
 * <ul>
 *   <li>Считывать результаты прошлых шагов и направлять в детали понятный полный отчёт. Azure: 3750</li>
 * </ul>
 *
 */

@Service("endExportProcessDone")
public class EndExportProcessDone implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(EndExportProcessDone.class);

    private final IMessageBusProducer messageBus;

    public EndExportProcessDone(IMessageBusProducer messageBus) {
        this.messageBus = messageBus;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        log.debug("Класс '{}' начал работу.", EndExportProcessDone.class.getSimpleName());
        ExportGpkgEvent event = (ExportGpkgEvent) delegateExecution.getVariable(EVENT_VAR_NAME);

        GkpgExportDetailsModel details = event.getGkpgExportDetailsModel();
        List<MessageFromExport> messages = details.getMessageFromExport();
        details.setMessageFromExport(messages);

        String pathToGpkg = delegateExecution.getVariable(GPKG_PATH_VAR_NAME).toString();
        details.setPathToGpkgFile(pathToGpkg);

        messages.add(new MessageFromExport("Процесс выгрузки GPKG был завершён."));
        details.setMessageFromExport(messages);
        String businessKey = (String) delegateExecution.getVariable(BUSINESS_KEY_VAR_NAME);

        PatchProcess patchProcess = new PatchProcess(DONE, details);
        messageBus.produce(new UpdateProcessEvent(event.getProcessId(), businessKey, event.getDbName(), patchProcess));

        log.debug("Всё хорошо завершили процесс. Успех!");
    }
}
