package ru.mycrg.integration_service.queue.handlers;

import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.variable.VariableMap;
import org.camunda.bpm.engine.variable.Variables;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service_contract.events.request.FileDeletedEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;
import static ru.mycrg.integration_service.bpmn.enums.BpmnProcessKey.REFERENCE_LAYER_DELETION_PROCESS;

@Service
public class FileDeletedEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(FileDeletedEventHandler.class);

    private final RuntimeService bpmnRuntimeService;

    public FileDeletedEventHandler(RuntimeService bpmnRuntimeService) {
        this.bpmnRuntimeService = bpmnRuntimeService;
    }

    @Override
    public String getEventType() {
        return FileDeletedEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent event) {
        try {
            FileDeletedEvent mqEvent = (FileDeletedEvent) event;
            VariableMap variables = Variables
                    .createVariables()
                    .putValue(ENTITY_ID_VAR_NAME, mqEvent.getFileId())
                    .putValue(TOKEN_VAR_NAME, mqEvent.getToken());

            bpmnRuntimeService.startProcessInstanceByKey(
                    REFERENCE_LAYER_DELETION_PROCESS.getValue(),
                    mqEvent.getFileId(),
                    variables);
        } catch (Exception e) {
            log.error("Не удалось стартовать процесс удаления слоёв из gis-service и geoserver: ", e);
        }
    }
}
