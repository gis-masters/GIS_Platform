package ru.mycrg.integration_service.bpmn.publication.shp;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.queue.request.PlaceShapeFileEvent;
import ru.mycrg.data_service_contract.queue.response.ShpPlacedSucceededEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.EVENT_VAR_NAME;

@Service("shpPlacementSuccessEventDelegate")
public class ShpPlacementSuccessEventDelegate implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(ShpPlacementSuccessEventDelegate.class);

    private final IMessageBusProducer messageBus;

    public ShpPlacementSuccessEventDelegate(IMessageBusProducer messageBus) {
        this.messageBus = messageBus;
    }

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        log.debug("Init shpPlacementSuccessEventDelegate");

        try {
            PlaceShapeFileEvent event = (PlaceShapeFileEvent) execution.getVariable(EVENT_VAR_NAME);

            messageBus.produce(new ShpPlacedSucceededEvent(event));
        } catch (Exception e) {
            log.error("Failed to send ShpPlacedSucceededEvent. Reason: {}", e.getMessage());
        }
    }
}
