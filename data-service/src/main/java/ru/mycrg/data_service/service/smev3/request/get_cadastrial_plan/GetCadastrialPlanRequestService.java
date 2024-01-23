package ru.mycrg.data_service.service.smev3.request.get_cadastrial_plan;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.config.Smev3Config;
import ru.mycrg.data_service.egrn_cadastrial_plans_1_1_2.*;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.register_rnv_1_0_8.QueryResult;
import ru.mycrg.data_service.service.reestrs.Systems;
import ru.mycrg.data_service.service.smev3.MnemonicEnum;
import ru.mycrg.data_service.service.smev3.RequestProcessor;
import ru.mycrg.data_service.service.smev3.SmevMessageSenderService;
import ru.mycrg.data_service.service.smev3.model.ProcessAdapterMessageResult;
import ru.mycrg.data_service.service.smev3.model.XmlBuildMeta;
import ru.mycrg.data_service.util.JsonConverter;

import java.util.UUID;

import static java.util.Optional.ofNullable;

@Service
@ConditionalOnProperty(
        value = "crg-options.integration.smev3.enabled",
        havingValue = "true",
        matchIfMissing = true)
public class GetCadastrialPlanRequestService extends RequestProcessor {
    private final Logger log = LoggerFactory.getLogger(GetCadastrialPlanRequestService.class);
    private final SmevMessageSenderService messageService;

    public GetCadastrialPlanRequestService(Smev3Config smev3Config,
                                           ResourceLoader resourceLoader,
                                           SmevMessageSenderService messageService) {
        super(MnemonicEnum.GET_CADASTRIAL_PLAN_1_1_2, resourceLoader, smev3Config);
        this.messageService = messageService;
    }

    public XmlBuildMeta request(@NotNull String requestFilename,
                                @NotNull String appFilename,
                                @NotNull String passportFilename,
                                @NotNull String archiveFilename) {
        try {
            var buildRequest = new GetCadastrialPlanXmlBuildProcess(
                    this
            ).run(requestFilename, appFilename, passportFilename);

            // валидация бизнес части запроса
            ofNullable(validate(buildRequest.getRequest(), Request.class)).ifPresent(s -> {
                throw new SmevRequestException("validation fail: " + s);
            });

            var clientMessage = clientMessage(buildRequest.getRequest(), archiveFilename);

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
            messageService.sendMessage(xmlMeta, true, Systems.FGIS_EGRN);

            return xmlMeta;
        } catch (Exception e) {
            throw new SmevRequestException("push to queue error :" + e.getMessage());
        }
    }

    @Override
    public ProcessAdapterMessageResult processMessageFromSmev(String messageBody) {
        try {
            //TODO тут ошибка, так как импорт некорректного класса
            var queryResult = xmlMarshaller()
                    .unmarshall(messageBody, QueryResult.class);

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

    private ClientMessage clientMessage(Request request, String archiveFilename) {
        ClientMessage clientMessage = new ClientMessage();
        MessagePrimaryContent messagePrimaryContent = new MessagePrimaryContent();
        messagePrimaryContent.setRequest(request);
        Content content = new Content();
        AttachmentHeaderList attachmentHeaderList = new AttachmentHeaderList();
        AttachmentHeaderType attachmentHeaderType = new AttachmentHeaderType();
        attachmentHeaderType.setFilePath(archiveFilename);
        attachmentHeaderList.getAttachmentHeader().add(attachmentHeaderType);
        content.setAttachmentHeaderList(attachmentHeaderList);
        content.setMessagePrimaryContent(messagePrimaryContent);
        RequestContentType requestContentType = new RequestContentType();
        requestContentType.setContent(content);
        RequestMetadataType requestMetadataType = new RequestMetadataType();
        requestMetadataType.setClientId(UUID.randomUUID().toString());
        RequestMessageType requestMessageType = new RequestMessageType();
        requestMessageType.setRequestMetadata(requestMetadataType);
        requestMessageType.setRequestContent(requestContentType);
        clientMessage.setItSystem(getSmev3Config().getSystemMnemonic());
        clientMessage.setRequestMessage(requestMessageType);

        return clientMessage;
    }
}
