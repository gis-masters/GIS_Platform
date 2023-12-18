package ru.mycrg.integration_service.bpmn.publication.mid;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.queue.request.PlaceMidFileEvent;
import ru.mycrg.data_service_contract.queue.response.MidPlacedFailedEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.EVENT_VAR_NAME;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.FAIL_REASON;

@Service("midPlacementFailedEventDelegate")
public class MidPlacementFailedEventDelegate implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(MidPlacementFailedEventDelegate.class);

    private final IMessageBusProducer messageBus;

    public MidPlacementFailedEventDelegate(IMessageBusProducer messageBus) {
        this.messageBus = messageBus;
    }

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        log.debug("Init midPlacementFailedEventDelegate");

        try {
            PlaceMidFileEvent event = (PlaceMidFileEvent) execution.getVariable(EVENT_VAR_NAME);
            String reason = (String) execution.getVariable(FAIL_REASON);

            log.debug("Send by reason: {}", reason);

            messageBus.produce(new MidPlacedFailedEvent(event, reason));
        } catch (Exception e) {
            log.error("Failed to send MidPlacedFailedEvent. Reason: {}", e.getMessage());
        }
    }
}
