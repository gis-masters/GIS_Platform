package ru.mycrg.integration_service.queue.handlers;

import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.variable.VariableMap;
import org.camunda.bpm.engine.variable.Variables;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.queue.request.PlaceMidFileEvent;
import ru.mycrg.data_service_contract.queue.response.MidPlacedFailedEvent;
import ru.mycrg.integration_service.bpmn.publication.dxf.store.CreateGeoserverStoreDto;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.IMessageBusProducer;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import static ru.mycrg.integration_service.bpmn.CamundaVariables.asJava;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.EVENT_VAR_NAME;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.TOKEN_VAR_NAME;
import static ru.mycrg.integration_service.bpmn.enums.BpmnProcessKey.MID_PLACEMENT_PROCESS;

@Service
public class PlaceMidFileEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(PlaceMidFileEventHandler.class);

    private final IMessageBusProducer messageBus;
    private final RuntimeService bpmnRuntimeService;

    public PlaceMidFileEventHandler(IMessageBusProducer messageBus,
                                    RuntimeService bpmnRuntimeService) {
        this.messageBus = messageBus;
        this.bpmnRuntimeService = bpmnRuntimeService;
    }

    @Override
    public String getEventType() {
        return PlaceMidFileEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent event) {
        log.debug("Init 'PlaceMidFileEvent'");

        PlaceMidFileEvent placeMidEvent = null;
        try {
            placeMidEvent = (PlaceMidFileEvent) event;
            CreateGeoserverStoreDto storeDto = new CreateGeoserverStoreDto(placeMidEvent.getWorkspaceName(),
                                                                           placeMidEvent.getStoreName(),
                                                                           placeMidEvent.getPathToFile());

            VariableMap variables = Variables
                    .createVariables()
                    .putValue(TOKEN_VAR_NAME, placeMidEvent.getToken())
                    .putValue("CreateGeoserverStoreDto", asJava(storeDto))
                    .putValue(EVENT_VAR_NAME, asJava(placeMidEvent));

            bpmnRuntimeService.startProcessInstanceByKey(
                    MID_PLACEMENT_PROCESS.getValue(),
                    placeMidEvent.getWsMsgId().toString(),
                    variables);
        } catch (Exception e) {
            String msg = "Не удалось стартовать процесс размещения MID файла. Reason: " + e.getMessage();
            log.error(msg, e.getMessage(), e);

            messageBus.produce(new MidPlacedFailedEvent(placeMidEvent, msg));
        }
    }
}
