package ru.mycrg.gis_service.queue.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.queue.request.DeleteGisReferencesEvent;
import ru.mycrg.data_service_contract.queue.response.DeletionGisReferencesSucceededEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.IMessageBusProducer;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

@Service
public class DeleteGisReferencesHandler implements IEventHandler {

    public static final Logger log = LoggerFactory.getLogger(DeleteGisReferencesHandler.class);

    @Autowired
    private IMessageBusProducer messageBus;

    @Override
    public String getEventType() {
        return "DeleteGisReferencesEvent";
    }

    @Override
    public void handle(IMessageBusEvent event) {
        DeleteGisReferencesEvent deleteGisReferencesEvent = (DeleteGisReferencesEvent) event;

        log.info("handle event: {}", event.getId());
        log.info("Msg: {}", deleteGisReferencesEvent.getMsg());

        String response = "SUCCESS handled: " + deleteGisReferencesEvent.getMsg();

        messageBus.produce(new DeletionGisReferencesSucceededEvent(event, response));
    }
}
