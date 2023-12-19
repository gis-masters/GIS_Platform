package ru.mycrg.data_service.service.smev3;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.entity.reestrs.ReestrOutgoing;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.service.reestrs.ReestrOutgoingService;
import ru.mycrg.data_service.service.reestrs.Systems;
import ru.mycrg.data_service.service.smev3.model.ReestrStatus;
import ru.mycrg.data_service.service.smev3.model.XmlBuildMeta;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@ConditionalOnProperty(
        value = "crg-options.integration.smev3.enabled",
        havingValue = "true",
        matchIfMissing = true)
public class SmevMessageSenderService {
    private final Logger log = LoggerFactory.getLogger(SmevMessageSenderService.class);
    private final RabbitTemplate rabbitTemplate;
    private final ReestrOutgoingService outgoingService;
    private final Queue adapterSendQueue;
    private final SmevMessageService messageService;

    public SmevMessageSenderService(RabbitTemplate rabbitSmevAdapterTemplate, ReestrOutgoingService outgoingService, Queue adapterSendQueue, SmevMessageService messageService) {
        this.rabbitTemplate = rabbitSmevAdapterTemplate;
        this.outgoingService = outgoingService;
        this.adapterSendQueue = adapterSendQueue;
        this.messageService = messageService;
    }


    @Transactional
    public void sendQueue(XmlBuildMeta buildMeta, Boolean sendQueue, String userTo) {
        try {
            log.debug("Try to save and send: " + buildMeta.toString());
            messageService.saveOutgoing(buildMeta, userTo);
            // TODO sendQueue - временное явление
            if (sendQueue) {
                log.info("message send to queue");
                rabbitTemplate.convertAndSend(adapterSendQueue.getName(), buildMeta.getXmlString());
            }
            log.info("Success save and send");
        } catch (Exception e) {
            log.error("Fail save and send. {}", e.getMessage());
            throw new SmevRequestException("Fail save and send. " + e.getMessage());
        }
    }
}
