package ru.mycrg.data_service.service.smev3;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.service.smev3.model.SmevRequestMeta;

@Service
@ConditionalOnProperty(
        value = "crg-options.integration.smev3.enabled",
        havingValue = "true",
        matchIfMissing = true)
public class SmevMessageSenderService {

    private final Logger log = LoggerFactory.getLogger(SmevMessageSenderService.class);

    private final Queue adapterSendQueue;
    private final RabbitTemplate rabbitTemplate;
    private final SmevMessageService messageService;

    public SmevMessageSenderService(RabbitTemplate rabbitSmevAdapterTemplate,
                                    Queue adapterSendQueue,
                                    SmevMessageService messageService) {
        this.rabbitTemplate = rabbitSmevAdapterTemplate;
        this.adapterSendQueue = adapterSendQueue;
        this.messageService = messageService;
    }

    @Transactional
    public void sendMessage(SmevRequestMeta requestMeta, String userTo) {
        messageService.saveOutgoing(requestMeta, userTo);

        sendMessage(requestMeta.getRequestXmlString());
    }

    public void sendMessage(String message) {
        try {
            log.debug("Попытка отправить сообщение в СМЭВ: {}", message);

            rabbitTemplate.convertAndSend(adapterSendQueue.getName(), message);

            log.info("Сообщение успешно отправлено очередь адаптера и сохранено");
        } catch (Exception e) {
            log.error("Ошибка при отправке сообщения в СМЭВ => {}", e.getMessage(), e);

            throw new SmevRequestException("Ошибка при отправке сообщения в СМЭВ. " + e.getMessage());
        }
    }
}
