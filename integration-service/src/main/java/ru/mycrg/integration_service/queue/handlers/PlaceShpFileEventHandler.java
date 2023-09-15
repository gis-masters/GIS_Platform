package ru.mycrg.integration_service.queue.handlers;

import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.variable.VariableMap;
import org.camunda.bpm.engine.variable.Variables;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.queue.request.PlaceShapeFileEvent;
import ru.mycrg.data_service_contract.queue.response.ShpPlacedFailedEvent;
import ru.mycrg.integration_service.bpmn.publication.dxf.store.CreateGeoserverStoreDto;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.IMessageBusProducer;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import static ru.mycrg.integration_service.bpmn.CamundaVariables.asJava;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.EVENT_VAR_NAME;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.TOKEN_VAR_NAME;
import static ru.mycrg.integration_service.bpmn.enums.BpmnProcessKey.SHP_PLACEMENT_PROCESS;

@Service
public class PlaceShpFileEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(PlaceShpFileEventHandler.class);

    private final IMessageBusProducer messageBus;
    private final RuntimeService bpmnRuntimeService;

    public PlaceShpFileEventHandler(IMessageBusProducer messageBus,
                                    RuntimeService bpmnRuntimeService) {
        this.messageBus = messageBus;
        this.bpmnRuntimeService = bpmnRuntimeService;
    }

    @Override
    public String getEventType() {
        return "PlaceShapeFileEvent";
    }

    @Override
    public void handle(IMessageBusEvent event) {
        log.debug("Init 'PlaceShapeFileEvent': {}", event.toString());

        PlaceShapeFileEvent placeShpEvent = null;
        try {
            placeShpEvent = (PlaceShapeFileEvent) event;
            CreateGeoserverStoreDto storeDto = new CreateGeoserverStoreDto(placeShpEvent.getWorkspaceName(),
                                                                           placeShpEvent.getStoreName(),
                                                                           placeShpEvent.getPathToFile());

            VariableMap variables = Variables
                    .createVariables()
                    .putValue(TOKEN_VAR_NAME, placeShpEvent.getToken())
                    .putValue("CreateGeoserverStoreDto", asJava(storeDto))
                    .putValue(EVENT_VAR_NAME, asJava(placeShpEvent));

            bpmnRuntimeService.startProcessInstanceByKey(
                    SHP_PLACEMENT_PROCESS.getValue(),
                    placeShpEvent.getWsMsgId().toString(),
                    variables);
        } catch (Exception e) {
            String msg = "Не удалось стартовать процесс размещения SHP файла. Reason: " + e.getMessage();
            log.error(msg, e.getMessage(), e);

            messageBus.produce(new ShpPlacedFailedEvent(placeShpEvent, msg));
        }
    }
}
