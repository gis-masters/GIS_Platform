package ru.mycrg.integration_service.bpmn.fiz;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.queue.request.PlaceDxfFileEvent;
import ru.mycrg.data_service_contract.queue.response.DxfPlacedFailedEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.EVENT_VAR_NAME;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.FAIL_REASON;

@Service("dxfPlacementFailedEventDelegate")
public class DxfPlacementFailedEventDelegate implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(DxfPlacementFailedEventDelegate.class);

    private final IMessageBusProducer messageBus;

    public DxfPlacementFailedEventDelegate(IMessageBusProducer messageBus) {
        this.messageBus = messageBus;
    }

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        log.debug("Init dxfPlacementFailedEventDelegate");

        try {
            PlaceDxfFileEvent event = (PlaceDxfFileEvent) execution.getVariable(EVENT_VAR_NAME);
            String reason = (String) execution.getVariable(FAIL_REASON);

            log.debug("Send by reason: {}", reason);

            messageBus.produce(new DxfPlacedFailedEvent(event, reason));
        } catch (Exception e) {
            log.error("Failed to send DxfPlacedFailedEvent. Reason: {}", e.getMessage());
        }
    }
}
