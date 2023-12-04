package ru.mycrg.data_service.service.smev3.register_rns;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.config.Smev3Config;
import ru.mycrg.data_service.dao.BaseDao;
import ru.mycrg.data_service.dto.smev3.RegisterRnsRequestDto;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.service.SchemaService;
import ru.mycrg.data_service.service.smev3.SmevOutgoingAttachmentService;
import ru.mycrg.data_service.service.smev3.model.XmlBuildMeta;
import ru.mycrg.data_service.service.smev3.receipt_rns.ReceiptRnsRequestService;

/**
 * urn://x-artefacts-uishc.domrf.ru/register-rns/1.0.10
 */
@Service
@ConditionalOnProperty(
        value = "crg-options.integration.smev3.enabled",
        havingValue = "true",
        matchIfMissing = true)
public class RegisterRnsRequestService {
    private final Logger log = LoggerFactory.getLogger(ReceiptRnsRequestService.class);
    private final Smev3Config smev3Config;
    private final RabbitTemplate rabbitTemplate;
    private final Queue adapterSendQueue;
    private final BaseDao baseDao;
    private final SchemaService schemaService;
    private final SmevOutgoingAttachmentService attachmentService;

    public RegisterRnsRequestService(Smev3Config smev3Config, RabbitTemplate rabbitSmevAdapterTemplate, Queue adapterSendQueue, BaseDao baseDao, SchemaService schemaService, SmevOutgoingAttachmentService attachmentService) {
        this.smev3Config = smev3Config;
        this.baseDao = baseDao;
        this.schemaService = schemaService;
        this.rabbitTemplate = rabbitSmevAdapterTemplate;
        this.adapterSendQueue = adapterSendQueue;
        this.attachmentService = attachmentService;
    }

    public XmlBuildMeta request(@NotNull RegisterRnsRequestDto dto) {
        log.info("SMEV3 | register-rns/1.0.10  recId {}", dto.getRecId());
        try {
            var meta = new RegisterRnsXmlBuildProcess(
                    smev3Config,
                    baseDao,
                    schemaService,
                    attachmentService
            ).run(dto.getRecId(), dto.getStubFields(), dto.getStubAttachments());

            if (dto.getSendToSmev()) {
                rabbitTemplate.convertAndSend(adapterSendQueue.getName(), meta.getXmlRequest());
                log.info("SMEV. Send message");
            }

            log.info("SMEV. ClientId: {}", meta.getClientId());

            return meta;
        } catch (Exception e) {
            log.error("SMEV. push to queue error: {}", e.getMessage());
            throw new SmevRequestException("push to queue error :" + e.getMessage());
        }
    }
}
