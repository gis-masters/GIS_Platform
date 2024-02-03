package ru.mycrg.data_service.service;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import ru.mycrg.auth_service_contract.events.response.SystemTagsUpdatedEvent;
import ru.mycrg.data_service.queue.MessageBusProducer;
import ru.mycrg.data_service.service.schemas.ISchemaService;
import ru.mycrg.data_service.service.smev3.support_classes.TransationWrapper;

import java.util.ArrayList;
import java.util.List;

@Component
public class SystemTagsPublisher {

    private final ISchemaService schemaService;
    private final TransationWrapper contextWrapper;
    private final MessageBusProducer messageBusProducer;

    public SystemTagsPublisher(@Qualifier("schemaServiceBase") ISchemaService schemaService,
                               TransationWrapper contextWrapper,
                               MessageBusProducer messageBusProducer) {
        this.schemaService = schemaService;
        this.contextWrapper = contextWrapper;
        this.messageBusProducer = messageBusProducer;
    }

    public void publish() {
        var ref = new Object() {
            List<String> systemTags;
        };
        contextWrapper.needTransaction(() -> {
            try {
                ref.systemTags = schemaService.getSystemTags();
            } catch (Exception e) {
                ref.systemTags = new ArrayList<>();
            }
        });

        messageBusProducer.produce(new SystemTagsUpdatedEvent(ref.systemTags));
    }
}
