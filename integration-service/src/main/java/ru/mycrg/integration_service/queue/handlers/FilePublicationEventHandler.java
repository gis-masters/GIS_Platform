package ru.mycrg.integration_service.queue.handlers;

import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.variable.VariableMap;
import org.camunda.bpm.engine.variable.Variables;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.queue.request.FilePublicationEvent;
import ru.mycrg.data_service_contract.queue.response.FilePublicationFailedEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.IMessageBusProducer;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import static ru.mycrg.integration_service.bpmn.CamundaVariables.asJava;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.EVENT_VAR_NAME;
import static ru.mycrg.integration_service.bpmn.enums.BpmnProcessKey.FILE_PLACEMENT_PROCESS;

@Service
public class FilePublicationEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(FilePublicationEventHandler.class);

    private final IMessageBusProducer messageBus;
    private final RuntimeService bpmnRuntimeService;

    public FilePublicationEventHandler(IMessageBusProducer messageBus,
                                       RuntimeService bpmnRuntimeService) {
        this.messageBus = messageBus;
        this.bpmnRuntimeService = bpmnRuntimeService;
    }

    @Override
    public String getEventType() {
        return FilePublicationEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent event) {
        FilePublicationEvent filePublicationEvent = null;
        try {
            filePublicationEvent = (FilePublicationEvent) event;

            log.debug("Старт процесса размещения '{}' файла", filePublicationEvent.getType());

            VariableMap variables = Variables.createVariables()
                                             .putValue(EVENT_VAR_NAME, asJava(filePublicationEvent));

            bpmnRuntimeService.startProcessInstanceByKey(
                    FILE_PLACEMENT_PROCESS.getValue(),
                    filePublicationEvent.getBaseWsProcess().getWsMsgId().toString(),
                    variables);
        } catch (Exception e) {
            String msg = String.format("Не удалось стартовать процесс размещения '%s' файла. По причине: %s",
                                       filePublicationEvent.getType(), e.getMessage());
            log.error(msg, e.getMessage(), e);

            messageBus.produce(new FilePublicationFailedEvent(filePublicationEvent, msg));
        }
    }
}
