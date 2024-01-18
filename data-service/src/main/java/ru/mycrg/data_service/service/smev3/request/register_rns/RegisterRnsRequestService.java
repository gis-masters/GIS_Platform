package ru.mycrg.data_service.service.smev3.request.register_rns;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.config.Smev3Config;
import ru.mycrg.data_service.dao.BaseDao;
import ru.mycrg.data_service.dto.smev3.RegisterRnsRequestDto;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.register_rns_1_0_10.QueryResult;
import ru.mycrg.data_service.service.schemas.SchemaService;
import ru.mycrg.data_service.service.reestrs.Systems;
import ru.mycrg.data_service.service.smev3.MnemonicEnum;
import ru.mycrg.data_service.service.smev3.RequestProcessor;
import ru.mycrg.data_service.service.smev3.SmevMessageSenderService;
import ru.mycrg.data_service.service.smev3.SmevOutgoingAttachmentService;
import ru.mycrg.data_service.service.smev3.model.ProcessAdapterMessageResult;
import ru.mycrg.data_service.service.smev3.model.XmlBuildMeta;
import ru.mycrg.data_service.service.smev3.request.receipt_rns.ReceiptRnsRequestService;
import ru.mycrg.data_service.util.JsonConverter;

import java.util.UUID;

/**
 * urn://x-artefacts-uishc.domrf.ru/register-rns/1.0.10
 */
@Service
@ConditionalOnProperty(
        value = "crg-options.integration.smev3.enabled",
        havingValue = "true",
        matchIfMissing = true)
public class RegisterRnsRequestService extends RequestProcessor {
    private final Logger log = LoggerFactory.getLogger(ReceiptRnsRequestService.class);
    private final BaseDao baseDao;
    private final SchemaService schemaService;
    private final SmevMessageSenderService messageService;
    private final SmevOutgoingAttachmentService attachmentService;

    public RegisterRnsRequestService(Smev3Config smev3Config,
                                     BaseDao baseDao,
                                     SchemaService schemaService,
                                     ResourceLoader resourceLoader,
                                     SmevMessageSenderService messageService,
                                     SmevOutgoingAttachmentService attachmentService) {
        super(MnemonicEnum.REGISTER_RNS_1_0_10, resourceLoader, smev3Config);
        this.baseDao = baseDao;
        this.schemaService = schemaService;
        this.messageService = messageService;
        this.attachmentService = attachmentService;
    }

    public XmlBuildMeta request(@NotNull RegisterRnsRequestDto dto) {
        log.info("SMEV3 | {}  recId {}", mnemonicEnum(), dto.getRecId());
        try {
            var buildMeta = new RegisterRnsXmlBuildProcess(
                    this,
                    baseDao,
                    schemaService,
                    attachmentService
            )
                    .run(dto);

            validate(buildMeta.getXmlString());

            log.info("SMEV3. ClientId: {}", buildMeta.getClientId());
            messageService.sendMessage(buildMeta, dto.getSendToSmev(), Systems.EIS_JS);

            return buildMeta;
        } catch (Exception e) {
            log.error("SMEV. push to queue error: {}", e.getMessage());
            throw new SmevRequestException("push to queue error :" + e.getMessage());
        }
    }

    @Override
    public ProcessAdapterMessageResult processMessageFromSmev(String messageBody) {
        try {
            var queryResult = xmlMarshaller().unmarshall(messageBody, QueryResult.class);

            var XmlBuildMeta = new XmlBuildMeta(
                    mnemonicEnum(),
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
