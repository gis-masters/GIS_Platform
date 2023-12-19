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
import ru.mycrg.data_service.register_rns_1_0_10.QueryResult;
import ru.mycrg.data_service.service.SchemaService;
import ru.mycrg.data_service.service.reestrs.Systems;
import ru.mycrg.data_service.service.smev3.ISmevMessageConsumer;
import ru.mycrg.data_service.service.smev3.SmevMessageSenderService;
import ru.mycrg.data_service.service.smev3.SmevOutgoingAttachmentService;
import ru.mycrg.data_service.service.smev3.model.ProcessAdapterMessageResult;
import ru.mycrg.data_service.service.smev3.model.XmlBuildMeta;
import ru.mycrg.data_service.service.smev3.receipt_rns.ReceiptRnsRequestService;
import ru.mycrg.data_service.service.smev3.support_classes.Mnemonic;
import ru.mycrg.data_service.service.smev3.support_classes.XmlMarshaller;
import ru.mycrg.data_service.util.JsonConverter;

import java.util.UUID;

import static ru.mycrg.data_service.service.smev3.register_rns.RegisterRnsXmlBuildProcess.namespacePrefixMapper;

/**
 * urn://x-artefacts-uishc.domrf.ru/register-rns/1.0.10
 */
@Service
@ConditionalOnProperty(
        value = "crg-options.integration.smev3.enabled",
        havingValue = "true",
        matchIfMissing = true)
public class RegisterRnsRequestService implements ISmevMessageConsumer {
    static final String MNEMONIC = "register-rns";
    static final String MNEMONIC_VERSION = "1.0.10";
    private final Logger log = LoggerFactory.getLogger(ReceiptRnsRequestService.class);
    private final XmlMarshaller marshaller = new XmlMarshaller(namespacePrefixMapper);
    private final Smev3Config smev3Config;
    private final BaseDao baseDao;
    private final SchemaService schemaService;
    private final SmevMessageSenderService messageService;
    private final SmevOutgoingAttachmentService attachmentService;

    public RegisterRnsRequestService(Smev3Config smev3Config, BaseDao baseDao, SchemaService schemaService, SmevMessageSenderService messageService, SmevOutgoingAttachmentService attachmentService) {
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
            messageService.sendQueue(buildMeta, dto.getSendToSmev(), Systems.EIS_JS);
            return buildMeta;
        } catch (Exception e) {
            log.error("SMEV. push to queue error: {}", e.getMessage());
            throw new SmevRequestException("push to queue error :" + e.getMessage());
        }
    }

    @Override
    public String consumerId() {
        return Mnemonic.id(MNEMONIC, MNEMONIC_VERSION);
    }

    @Override
    public ProcessAdapterMessageResult consumeAdapterMessage(String messageBody) {
        try {
            var queryResult = marshaller.unmarshall(messageBody, QueryResult.class);

            var XmlBuildMeta = new XmlBuildMeta(
                    MNEMONIC,
                    MNEMONIC_VERSION,
                    UUID.fromString(queryResult.getMessage().getResponseMetadata().getClientId()),
                    UUID.fromString(queryResult.getMessage().getResponseMetadata().getReplyToClientId()),
                    JsonConverter.toJsonNode(queryResult),
                    messageBody,
                    null,
                    null
            );
            String status;
            String message;

            if (queryResult.getMessage().getMessageType().equals("RejectMessage")) {
                status = queryResult.getMessage().getResponseContent().getRejects().get(0).getCode();
                message = queryResult.getMessage().getResponseContent().getRejects().get(0).getDescription();
            } else {
                status = queryResult.getMessage().getResponseContent().getStatus().getCode();
                message = queryResult.getMessage().getResponseContent().getStatus().getDescription();
            }

            return new ProcessAdapterMessageResult()
                    .setXmlBuildMeta(XmlBuildMeta)
                    .setStatus(status)
                    .setMessage(message);
        } catch (Exception e) {
            log.error("Process adapter message error: {}", e.getMessage());
            throw new SmevRequestException("process adapter message error :" + e.getMessage());
        }
    }
}
