package ru.mycrg.data_service.queue.handlers;

import org.springframework.stereotype.Service;
import ru.mycrg.auth_service_contract.events.request.SystemTagsRequestEvent;
import ru.mycrg.data_service.service.SystemTagsPublisher;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

@Service
public class SystemTagsRequestEventHandler implements IEventHandler {

    private final SystemTagsPublisher systemTagsPublisher;

    public SystemTagsRequestEventHandler(SystemTagsPublisher systemTagsPublisher) {
        this.systemTagsPublisher = systemTagsPublisher;
    }

    @Override
    public String getEventType() {
        return SystemTagsRequestEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        systemTagsPublisher.publish();
    }
}
