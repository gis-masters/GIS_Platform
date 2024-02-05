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
import ru.mycrg.data_service.dto.smev3.ISmevRequestDto;
import ru.mycrg.data_service.dto.smev3.RegisterRnvRequestDto;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.register_rnv_1_0_8.*;
import ru.mycrg.data_service.service.schemas.ISchemaService;
import ru.mycrg.data_service.service.smev3.Mnemonic;
import ru.mycrg.data_service.service.smev3.SmevMessageSenderService;
import ru.mycrg.data_service.service.smev3.SmevOutgoingAttachmentService;
import ru.mycrg.data_service.service.smev3.model.BuildRequestAndSources;
import ru.mycrg.data_service.service.smev3.model.ProcessAdapterMessageResult;
import ru.mycrg.data_service.service.smev3.model.XmlBuildMeta;
import ru.mycrg.data_service.service.smev3.request.RequestProcessor;
import ru.mycrg.data_service.util.JsonConverter;

import java.util.UUID;
import java.util.stream.Collectors;


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

    public RegisterRnvRequestService(
            SmevMessageSenderService messageService,
            Smev3Config smev3Config,
            BaseDao baseDao,
            @Qualifier("schemaServiceBase") ISchemaService schemaService,
            ResourceLoader resourceLoader,
            SmevOutgoingAttachmentService attachmentService
    ) {
        super(
                Mnemonic.REGISTER_RNV_1_0_8,
                messageService,
                baseDao,
                schemaService,
                attachmentService,
                resourceLoader,
                smev3Config
        );
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


    @Override
    protected XmlBuildMeta buildRequest(@NotNull ISmevRequestDto dto) throws Exception {
        var buildRequest = new RegisterRnvXmlBuildProcess(this).run((RegisterRnvRequestDto) dto);
        var clientMessage = clientMessage(buildRequest);
        var meta = new XmlBuildMeta(
                mnemonicEnum(),
                UUID.fromString(clientMessage.getRequestMessage().getRequestMetadata().getClientId()),
                null,
                xmlMarshaller().marshall(clientMessage, ClientMessage.class),
                JsonConverter.toJsonNode(clientMessage),
                buildRequest.getSourcesJson(),
                buildRequest.getAttachmentsJson()
        );
        validate(meta, buildRequest.getRequest(), Request.class);

        return meta;
    }

    private ClientMessage clientMessage(BuildRequestAndSources<Request> buildRequestAndSources) {
        var content = new Content();

        // PrimaryContent
        var primaryContent = new MessagePrimaryContent();
        primaryContent.setRequest(buildRequestAndSources.getRequest());
        content.setMessagePrimaryContent(primaryContent);

        // AttachmentHeaderList
        var attachmentHeaderTypeList = buildRequestAndSources.getAttachmentsMap()
                .values()
                .stream()
                .map(smevAttachment -> {
                    var type = new AttachmentHeaderType();
                    type.setId(smevAttachment.getAttachmentId().toString());
                    type.setFilePath(smevAttachment.getS3fileName());
                    return type;
                })
                .collect(Collectors.toList());

        if (!attachmentHeaderTypeList.isEmpty()) {
            var attachmentHeaderList = new AttachmentHeaderList();
            attachmentHeaderList.getAttachmentHeader().addAll(attachmentHeaderTypeList);
            content.setAttachmentHeaderList(attachmentHeaderList);
        }

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
