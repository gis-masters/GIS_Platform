package ru.mycrg.data_service.queue;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import ru.mycrg.messagebus_contract.IMessageBusConsumer;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import static ru.mycrg.messagebus_contract.MessageBusProperties.IMPORT_KPT_TASK_QUEUE;

/**
 * Получает запросы на импорт из очереди rabbit и отправляет на обработку
 */
@Service
public class KptImportRequestListener implements IMessageBusConsumer {

    private final IMessageBusConsumer messageBus;

    public KptImportRequestListener(IMessageBusConsumer messageBus) {
        this.messageBus = messageBus;
    }

    @Override
    @RabbitListener(queues = { IMPORT_KPT_TASK_QUEUE })
    public void consume(IMessageBusEvent event) {
        messageBus.consume(event);
    }
}
