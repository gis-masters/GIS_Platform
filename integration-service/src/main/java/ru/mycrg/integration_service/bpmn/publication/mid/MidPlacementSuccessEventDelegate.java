package ru.mycrg.integration_service.bpmn.publication.mid;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.queue.request.PlaceMidFileEvent;
import ru.mycrg.data_service_contract.queue.response.MidPlacedSucceededEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.EVENT_VAR_NAME;

@Service("midPlacementSuccessEventDelegate")
public class MidPlacementSuccessEventDelegate implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(MidPlacementSuccessEventDelegate.class);

    private final IMessageBusProducer messageBus;

    public MidPlacementSuccessEventDelegate(IMessageBusProducer messageBus) {
        this.messageBus = messageBus;
    }

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        log.debug("Init midPlacementSuccessEventDelegate");

        try {
            PlaceMidFileEvent event = (PlaceMidFileEvent) execution.getVariable(EVENT_VAR_NAME);

            messageBus.produce(new MidPlacedSucceededEvent(event));
        } catch (Exception e) {
            log.error("Failed to send MidPlacedSucceededEvent. Reason: {}", e.getMessage());
        }
    }
}
