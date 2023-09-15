package ru.mycrg.integration_service.bpmn.publication.shp;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.queue.request.PlaceShapeFileEvent;
import ru.mycrg.data_service_contract.queue.response.ShpPlacedFailedEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.EVENT_VAR_NAME;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.FAIL_REASON;

@Service("shpPlacementFailedEventDelegate")
public class ShpPlacementFailedEventDelegate implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(ShpPlacementFailedEventDelegate.class);

    private final IMessageBusProducer messageBus;

    public ShpPlacementFailedEventDelegate(IMessageBusProducer messageBus) {
        this.messageBus = messageBus;
    }

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        log.debug("Init shpPlacementFailedEventDelegate");

        try {
            PlaceShapeFileEvent event = (PlaceShapeFileEvent) execution.getVariable(EVENT_VAR_NAME);
            String reason = (String) execution.getVariable(FAIL_REASON);

            log.debug("Send by reason: {}", reason);

            messageBus.produce(new ShpPlacedFailedEvent(event, reason));
        } catch (Exception e) {
            log.error("Failed to send ShpPlacedFailedEvent. Reason: {}", e.getMessage());
        }
    }
}
