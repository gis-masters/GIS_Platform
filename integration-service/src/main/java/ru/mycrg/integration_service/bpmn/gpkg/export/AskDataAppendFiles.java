package ru.mycrg.integration_service.bpmn.gpkg.export;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.export.ExportGpkgPayload;
import ru.mycrg.data_service_contract.dto.ExportResourceModel;
import ru.mycrg.data_service_contract.queue.request.gpkg.*;
import ru.mycrg.data_service_contract.queue.request.gpkg.ExportGpkgEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.util.List;

import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

@Service("askDataAppendFiles")
public class AskDataAppendFiles implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(AskDataAppendFiles.class);

    private final IMessageBusProducer messageBus;

    public AskDataAppendFiles(IMessageBusProducer messageBus) {
        this.messageBus = messageBus;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        log.debug("Класс '{}' начал работу.", AskDataAppendFiles.class.getSimpleName());

        ExportGpkgEvent event = (ExportGpkgEvent) delegateExecution.getVariable(EVENT_VAR_NAME);
        String pathToGpkg = delegateExecution.getVariable(GPKG_PATH_VAR_NAME).toString();
        ExportGpkgPayload subPayload = (ExportGpkgPayload) delegateExecution.getVariable(EVENT_SUB_PAYLOAD_NAME);
        List<ExportResourceModel> resources = (List<ExportResourceModel>) subPayload.getPayload();

        String businessKey = (String) delegateExecution.getVariable(BUSINESS_KEY_VAR_NAME);

        messageBus.produce(new AppendGpkgFilesEvent(event.getDbName(), businessKey, pathToGpkg, resources));

        log.debug("Запрос на добавление файлов в gpkg был направлен.");
    }
}
