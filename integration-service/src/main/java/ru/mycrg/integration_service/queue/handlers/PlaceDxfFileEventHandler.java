package ru.mycrg.integration_service.queue.handlers;

import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.variable.VariableMap;
import org.camunda.bpm.engine.variable.Variables;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.queue.request.PlaceDxfFileEvent;
import ru.mycrg.data_service_contract.queue.response.DxfPlacedFailedEvent;
import ru.mycrg.integration_service.bpmn.publication.dxf.store.CreateGeoserverStoreDto;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.IMessageBusProducer;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import static ru.mycrg.integration_service.bpmn.CamundaVariables.asJava;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;
import static ru.mycrg.integration_service.bpmn.enums.BpmnProcessKey.DXF_PLACEMENT_PROCESS;

@Service
public class PlaceDxfFileEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(PlaceDxfFileEventHandler.class);

    private final IMessageBusProducer messageBus;
    private final RuntimeService bpmnRuntimeService;

    public PlaceDxfFileEventHandler(IMessageBusProducer messageBus,
                                    RuntimeService bpmnRuntimeService) {
        this.messageBus = messageBus;
        this.bpmnRuntimeService = bpmnRuntimeService;
    }

    @Override
    public String getEventType() {
        return "PlaceDxfFileEvent";
    }

    @Override
    public void handle(IMessageBusEvent event) {
        log.debug("Init 'PlaceDxfFileEvent'");

        PlaceDxfFileEvent placeDxfEvent = null;
        try {
            placeDxfEvent = (PlaceDxfFileEvent) event;
            CreateGeoserverStoreDto storeDto = new CreateGeoserverStoreDto(placeDxfEvent.getWorkspaceName(),
                                                                           placeDxfEvent.getStoreName(),
                                                                           placeDxfEvent.getPathToFile());

            VariableMap variables = Variables
                    .createVariables()
                    .putValue(TOKEN_VAR_NAME, placeDxfEvent.getToken())
                    .putValue("CreateGeoserverStoreDto", asJava(storeDto))
                    .putValue(EVENT_VAR_NAME, asJava(placeDxfEvent));

            bpmnRuntimeService.startProcessInstanceByKey(
                    DXF_PLACEMENT_PROCESS.getValue(),
                    placeDxfEvent.getWsMsgId().toString(),
                    variables);
        } catch (Exception e) {
            String msg = "Не удалось стартовать процесс размещения DXF файла. Reason: " + e.getMessage();
            log.error(msg, e.getMessage(), e);

            messageBus.produce(new DxfPlacedFailedEvent(placeDxfEvent, msg));
        }
    }
}
