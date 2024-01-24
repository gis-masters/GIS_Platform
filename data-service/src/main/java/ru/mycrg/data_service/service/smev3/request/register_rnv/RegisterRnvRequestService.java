package ru.mycrg.data_service.service.smev3.request.register_rnv;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.config.Smev3Config;
import ru.mycrg.data_service.dao.BaseDao;
import ru.mycrg.data_service.dto.smev3.RegisterRnvRequestDto;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.register_rnv_1_0_8.*;
import ru.mycrg.data_service.service.reestrs.Systems;
import ru.mycrg.data_service.service.schemas.ISchemaService;
import ru.mycrg.data_service.service.smev3.MnemonicEnum;
import ru.mycrg.data_service.service.smev3.RequestProcessor;
import ru.mycrg.data_service.service.smev3.SmevMessageSenderService;
import ru.mycrg.data_service.service.smev3.model.ProcessAdapterMessageResult;
import ru.mycrg.data_service.service.smev3.model.XmlBuildMeta;
import ru.mycrg.data_service.util.JsonConverter;

import java.util.UUID;

import static java.util.Optional.ofNullable;


/**
 * urn://x-artefacts-uishc.domrf.ru/register-rnv/1.0.8
 */
@Service
@ConditionalOnProperty(
        value = "crg-options.integration.smev3.enabled",
        havingValue = "true",
        matchIfMissing = true)
public class RegisterRnvRequestService extends RequestProcessor {

    private final Logger log = LoggerFactory.getLogger(RegisterRnvRequestService.class);
    private final BaseDao baseDao;
    private final ISchemaService schemaService;
    private final SmevMessageSenderService messageService;

    public RegisterRnvRequestService(Smev3Config smev3Config,
                                     BaseDao baseDao,
                                     @Qualifier("schemaServiceBase") ISchemaService schemaService,
                                     ResourceLoader resourceLoader,
                                     SmevMessageSenderService messageService) {
        super(MnemonicEnum.REGISTER_RNV_1_0_8, resourceLoader, smev3Config);
        this.baseDao = baseDao;
        this.schemaService = schemaService;
        this.messageService = messageService;
    }

    public XmlBuildMeta request(@NotNull RegisterRnvRequestDto dto) {
        log.info("SMEV3 | {}  recId {}", mnemonicEnum(), dto.getRecId());
        try {
            var buildRequest = new RegisterRnvXmlBuildProcess(
                    this,
                    baseDao,
                    schemaService
            ).run(dto);

            // валидация бизнес части запроса
            ofNullable(validate(buildRequest.getRequest(), Request.class)).ifPresent(s -> {
                throw new SmevRequestException("validation fail: " + s);
            });

            var clientMessage = clientMessage(buildRequest.getRequest());

            var xmlMeta = new XmlBuildMeta(
                    mnemonicEnum(),
                    UUID.fromString(clientMessage.getQueryMessage().getClientId()),
                    null,
                    xmlMarshaller().marshall(clientMessage, ClientMessage.class),
                    JsonConverter.toJsonNode(clientMessage),
                    buildRequest.getSourcesJson(),
                    buildRequest.getAttachmentsJson()
            );

            log.info("SMEV3. ClientId: {}", xmlMeta.getClientId());
            messageService.sendMessage(xmlMeta, dto.getSendToSmev(), Systems.EIS_JS);

            return xmlMeta;
        } catch (Exception e) {
            if (e instanceof SmevRequestException) {
                throw (SmevRequestException) e;
            }

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
                    messageBody,
                    JsonConverter.toJsonNode(queryResult),
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


    private ClientMessage clientMessage(Request request) {
        var primaryContent = new MessagePrimaryContent();
        primaryContent.setRequest(request);

        var content = new Content();
        content.setMessagePrimaryContent(primaryContent);

        var contentType = new RequestContentType();
        contentType.setContent(content);

        var metadataType = new RequestMetadataType();
        metadataType.setClientId(UUID.randomUUID().toString());

        var messageType = new RequestMessageType();
        messageType.setRequestMetadata(metadataType);
        messageType.setRequestContent(contentType);

        var clientMessage = new ClientMessage();
        clientMessage.setItSystem(getSmev3Config().getSystemMnemonic());
        clientMessage.setRequestMessage(messageType);

        return clientMessage;
    }
}
