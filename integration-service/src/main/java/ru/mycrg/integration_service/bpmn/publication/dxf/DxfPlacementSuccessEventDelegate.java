package ru.mycrg.integration_service.bpmn.publication.dxf;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.queue.request.PlaceDxfFileEvent;
import ru.mycrg.data_service_contract.queue.response.DxfPlacedSucceededEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.EVENT_VAR_NAME;

@Service("dxfPlacementSuccessEventDelegate")
public class DxfPlacementSuccessEventDelegate implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(DxfPlacementSuccessEventDelegate.class);

    private final IMessageBusProducer messageBus;

    public DxfPlacementSuccessEventDelegate(IMessageBusProducer messageBus) {
        this.messageBus = messageBus;
    }

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        log.debug("Init dxfPlacementSuccessEventDelegate");

        try {
            PlaceDxfFileEvent event = (PlaceDxfFileEvent) execution.getVariable(EVENT_VAR_NAME);

            messageBus.produce(new DxfPlacedSucceededEvent(event));
        } catch (Exception e) {
            log.error("Failed to send DxfPlacedSucceededEvent. Reason: {}", e.getMessage());
        }
    }
}
