package ru.mycrg.data_service.service.smev3.register_rns;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.config.Smev3Config;
import ru.mycrg.data_service.dao.BaseDao;
import ru.mycrg.data_service.dto.smev3.RegisterRnsRequestDto;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.service.SchemaService;
import ru.mycrg.data_service.service.smev3.SmevMessageService;
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
    private final BaseDao baseDao;
    private final SchemaService schemaService;
    private final SmevMessageService messageService;
    private final SmevOutgoingAttachmentService attachmentService;

    public RegisterRnsRequestService(Smev3Config smev3Config, BaseDao baseDao, SchemaService schemaService, SmevMessageService messageService, SmevOutgoingAttachmentService attachmentService) {
        this.smev3Config = smev3Config;
        this.baseDao = baseDao;
        this.schemaService = schemaService;
        this.messageService = messageService;
        this.attachmentService = attachmentService;
    }

    public XmlBuildMeta request(@NotNull RegisterRnsRequestDto dto) {
        log.info("SMEV3 | register-rns/1.0.10  recId {}", dto.getRecId());
        try {
            var buildMeta = new RegisterRnsXmlBuildProcess(
                    smev3Config,
                    baseDao,
                    schemaService,
                    attachmentService
            ).run(dto.getRecId(), dto.getStubFields(), dto.getStubAttachments());
            log.info("SMEV3. ClientId: {}", buildMeta.getClientId());
            messageService.sendQueue(buildMeta, dto.getSendToSmev());
            return buildMeta;
        } catch (Exception e) {
            log.error("SMEV. push to queue error: {}", e.getMessage());
            throw new SmevRequestException("push to queue error :" + e.getMessage());
        }
    }
}
