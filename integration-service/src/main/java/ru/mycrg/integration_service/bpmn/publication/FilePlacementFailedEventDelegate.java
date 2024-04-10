package ru.mycrg.integration_service.bpmn.publication;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.queue.request.FilePublicationEvent;
import ru.mycrg.data_service_contract.queue.response.FilePublicationFailedEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.EVENT_VAR_NAME;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.FAIL_REASON;

@Service("filePlacementFailedEventDelegate")
public class FilePlacementFailedEventDelegate implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(FilePlacementFailedEventDelegate.class);

    private final IMessageBusProducer messageBus;

    public FilePlacementFailedEventDelegate(IMessageBusProducer messageBus) {
        this.messageBus = messageBus;
    }

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        log.debug("Процесс размещения файла завершился неудачей");

        try {
            FilePublicationEvent event = (FilePublicationEvent) execution.getVariable(EVENT_VAR_NAME);
            String reason = (String) execution.getVariable(FAIL_REASON);

            messageBus.produce(new FilePublicationFailedEvent(event, reason));
        } catch (Exception e) {
            log.error("Failed to send FilePublicationEvent. Reason: {}", e.getMessage());
        }
    }
}
