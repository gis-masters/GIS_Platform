package ru.mycrg.data_service.service.smev3;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.entity.reestrs.ReestrOutgoing;
import ru.mycrg.data_service.entity.smev.SmevMessageMetaEntity;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.repository.reestrs.ReestrOutgoingRepository;
import ru.mycrg.data_service.repository.smev.SmevMessageMetaRepository;
import ru.mycrg.data_service.service.reestrs.Systems;
import ru.mycrg.data_service.service.smev3.model.ReestrStatus;
import ru.mycrg.data_service.service.smev3.model.XmlBuildMeta;
import ru.mycrg.data_service.util.JsonConverter;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@ConditionalOnProperty(
        value = "crg-options.integration.smev3.enabled",
        havingValue = "true",
        matchIfMissing = true)
public class SmevMessageService {
    private final Logger log = LoggerFactory.getLogger(SmevMessageService.class);
    private final ReestrOutgoingRepository outgoingRepository;
    private final SmevMessageMetaRepository messageMetaRepository;
    private final RabbitTemplate rabbitTemplate;
    private final Queue adapterSendQueue;

    public SmevMessageService(ReestrOutgoingRepository outgoingRepository, SmevMessageMetaRepository messageMetaRepository, RabbitTemplate rabbitSmevAdapterTemplate, Queue adapterSendQueue) {
        this.outgoingRepository = outgoingRepository;
        this.messageMetaRepository = messageMetaRepository;
        this.rabbitTemplate = rabbitSmevAdapterTemplate;
        this.adapterSendQueue = adapterSendQueue;
    }

    public XmlBuildMeta getMeta(UUID id) {
        log.debug("get meta by {}", id);

        var message = messageMetaRepository.findById(id)
                .orElseThrow(() -> new SmevRequestException("record not found"));

        return new XmlBuildMeta(
                message.getMnemonic(),
                message.getMnemonicVersion(),
                message.getClientId(),
                message.getXmlObject(),
                message.getXmlString(),
                message.getRecords(),
                message.getAttachments()
        );
    }

    @Transactional
    public void sendQueue(XmlBuildMeta buildMeta, Boolean sendQueue) {
        var now = LocalDateTime.now();

        // reestr message
        var reestrMessage = new ReestrOutgoing();
        reestrMessage.setId(UUID.randomUUID());
        reestrMessage.setBody(buildMeta.getXmlString());
        reestrMessage.setDateOut(now);
        reestrMessage.setStatus(ReestrStatus.SEND_QUEUE.getTitle());
        reestrMessage.setSystem(Systems.GISOGR_RK);
        reestrMessage.setUserTo(Systems.EIS_JS);
        outgoingRepository.save(reestrMessage);

        log.info("save reestr message. id:{}", reestrMessage.getId());

        // smev message
        var smevMessage = SmevMessageMetaEntity.createOutgoing(
                        buildMeta.getMnemonic(),
                        buildMeta.getMnemonicVersion(),
                        buildMeta.getClientId(),
                        reestrMessage.getId(),
                        JsonConverter.toJsonNode(buildMeta.getXmlObject()),
                        buildMeta.getXmlString()
                )
                .setRecords(JsonConverter.toJsonNode(buildMeta.getSources()))
                .setAttachments(JsonConverter.toJsonNode(buildMeta.getAttachments()))
                .setCreatedAt(now);
        messageMetaRepository.save(smevMessage);

        log.info("save smev message. id:{}", smevMessage.getId());

        // TODO sendQueue - временное явление
        if (sendQueue) {
            log.debug("message send to queue");
            rabbitTemplate.convertAndSend(adapterSendQueue.getName(), buildMeta.getXmlString());
        }
    }
}
