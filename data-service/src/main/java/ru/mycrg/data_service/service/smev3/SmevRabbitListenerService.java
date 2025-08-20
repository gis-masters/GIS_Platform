package ru.mycrg.data_service.service.smev3;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.service.smev3.support_classes.TransactionWrapper;

@Service
@ConditionalOnProperty(
        value = "crg-options.integration.smev3.enabled",
        havingValue = "true",
        matchIfMissing = true)
public class SmevRabbitListenerService {

    private final Logger log = LoggerFactory.getLogger(SmevRabbitListenerService.class);

    private final TransactionWrapper contextWrapper;
    private final SmevMessageReceiverService smevMessageReceiverService;

    public SmevRabbitListenerService(SmevMessageReceiverService smevMessageReceiverService,
                                     TransactionWrapper contextWrapper) {
        this.contextWrapper = contextWrapper;
        this.smevMessageReceiverService = smevMessageReceiverService;
    }

    @RabbitListener(containerFactory = "smevRabbitContainerFactory", queues = "#{adapterReceiveQueue}")
    public void receiveMessage(Message message) {
        try {
            log.info("Получено сообщение из очереди: {}", message);
            contextWrapper.needTransaction(() -> smevMessageReceiverService.processReceiveMessage(message));
        } catch (Exception e) {
            log.error("Сообщение из СМЭВ не обработано. Ошибка: {}", e.getMessage());
        }
    }
}
