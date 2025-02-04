package ru.mycrg.integration_service.bpmn.publication;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.queue.request.FilePublicationEvent;
import ru.mycrg.data_service_contract.queue.response.FileSucceededPublishedEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.EVENT_VAR_NAME;

@Service("filePlacementSuccessEventDelegate")
public class FilePlacementSuccessEventDelegate implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(FilePlacementSuccessEventDelegate.class);

    private final IMessageBusProducer messageBus;

    public FilePlacementSuccessEventDelegate(IMessageBusProducer messageBus) {
        this.messageBus = messageBus;
    }

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        log.debug("Процесс размещения файла успешно завершен");

        try {
            FilePublicationEvent event = (FilePublicationEvent) execution.getVariable(EVENT_VAR_NAME);

            messageBus.produce(new FileSucceededPublishedEvent(event));
        } catch (Exception e) {
            log.error("Failed to send FilePublicationEvent. Reason: {}", e.getMessage());
        }
    }
}
