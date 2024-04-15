package ru.mycrg.data_service.service.smev3;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.service.smev3.support_classes.TransationWrapper;

@Service
@ConditionalOnProperty(
        value = "crg-options.integration.smev3.enabled",
        havingValue = "true",
        matchIfMissing = true)
public class SmevRabbitListenerService {
    private final Logger log = LoggerFactory.getLogger(SmevRabbitListenerService.class);
    private final SmevMessageReceiverService smevMessageReceiverService;
    private final Queue adapterReceiveQueue;
    private final TransationWrapper contextWrapper;

    public SmevRabbitListenerService(SmevMessageReceiverService smevMessageReceiverService,
                                     Queue adapterReceiveQueue,
                                     TransationWrapper contextWrapper) {
        this.smevMessageReceiverService = smevMessageReceiverService;
        this.adapterReceiveQueue = adapterReceiveQueue;
        this.contextWrapper = contextWrapper;
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
