package ru.mycrg.data_service.queue.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service_contract.queue.request.KptImportXmlRequestEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

/** Обработчик запроса на импорт КПТ из XML */
@Component
public class KptImportXmlHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(KptImportXmlHandler.class);

    @Override
    public String getEventType() {
        return KptImportXmlRequestEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent event) {
        log.info("Получено событие импорта КПТ из XML id: {}", event.getId());
    }
}
