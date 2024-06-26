package ru.mycrg.data_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import ru.mycrg.auth_service_contract.events.response.SystemTagsUpdatedEvent;
import ru.mycrg.data_service.queue.MessageBusProducer;
import ru.mycrg.data_service.service.schemas.ISchemaTemplateService;
import ru.mycrg.data_service.service.smev3.support_classes.TransactionWrapper;

import java.util.ArrayList;
import java.util.List;

@Component
public class SystemTagsPublisher {

    private final Logger log = LoggerFactory.getLogger(SystemTagsPublisher.class);

    private final ISchemaTemplateService schemaService;
    private final TransactionWrapper contextWrapper;
    private final MessageBusProducer messageBusProducer;

    public SystemTagsPublisher(@Qualifier("schemaTemplateServiceBase") ISchemaTemplateService schemaService,
                               TransactionWrapper contextWrapper,
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

        log.debug("Публикация системных тегов: {}", ref.systemTags);

        messageBusProducer.produce(new SystemTagsUpdatedEvent(ref.systemTags));
    }
}
