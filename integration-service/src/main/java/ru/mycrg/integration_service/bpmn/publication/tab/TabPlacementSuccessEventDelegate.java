package ru.mycrg.integration_service.bpmn.publication.tab;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.queue.request.PlaceTabFileEvent;
import ru.mycrg.data_service_contract.queue.response.TabPlacedSucceededEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.EVENT_VAR_NAME;

@Service("tabPlacementSuccessEventDelegate")
public class TabPlacementSuccessEventDelegate implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(TabPlacementSuccessEventDelegate.class);

    private final IMessageBusProducer messageBus;

    public TabPlacementSuccessEventDelegate(IMessageBusProducer messageBus) {
        this.messageBus = messageBus;
    }

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        log.debug("Init tabPlacementSuccessEventDelegate");

        try {
            PlaceTabFileEvent event = (PlaceTabFileEvent) execution.getVariable(EVENT_VAR_NAME);

            messageBus.produce(new TabPlacedSucceededEvent(event));
        } catch (Exception e) {
            log.error("Failed to send TabPlacedSucceededEvent. Reason: {}", e.getMessage());
        }
    }
}
