package ru.mycrg.data_service.service.smev3.request.register_rns;

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
import ru.mycrg.data_service.dto.smev3.RegisterRnsRequestDto;
import ru.mycrg.data_service.register_rns_1_0_10.*;
import ru.mycrg.data_service.service.schemas.ISchemaTemplateService;
import ru.mycrg.data_service.service.smev3.Mnemonic;
import ru.mycrg.data_service.service.smev3.SmevMessageSenderService;
import ru.mycrg.data_service.service.smev3.SmevOutgoingAttachmentService;
import ru.mycrg.data_service.service.smev3.model.BuildRequestAndSources;
import ru.mycrg.data_service.service.smev3.model.XmlBuildMeta;
import ru.mycrg.data_service.service.smev3.request.RequestProcessor;
import ru.mycrg.data_service.service.smev3.request.receipt_rns.ReceiptRnsRequestService;
import ru.mycrg.data_service.util.JsonConverter;

import java.util.UUID;
import java.util.stream.Collectors;

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
    private final RegisterRnsResponseService registerRnsResponseService;

    public RegisterRnsRequestService(Smev3Config smev3Config,
                                     BaseDao baseDao,
                                     @Qualifier("schemaTemplateServiceBase") ISchemaTemplateService schemaService,
                                     ResourceLoader resourceLoader,
                                     SmevMessageSenderService messageService,
                                     SmevOutgoingAttachmentService attachmentService,
                                     RegisterRnsResponseService registerRnsResponseService) {
        super(Mnemonic.REGISTER_RNS_1_0_10, messageService, baseDao, schemaService, attachmentService, resourceLoader, smev3Config);
        this.registerRnsResponseService = registerRnsResponseService;
    }

    @Override
    public XmlBuildMeta sendRequest(@NotNull ISmevRequestDto dto) {
        if (dto.isStubResponse()) {
            registerRnsResponseService.processMessageFromSmev(dto.getStubSmevResponseAsXml());
            return null;
        } else {
            return super.sendRequest(dto);
        }
    }

    @Override
    protected XmlBuildMeta buildRequest(@NotNull ISmevRequestDto dto) throws Exception {
        log.debug("build xml request " + dto);

        var buildRequest = new RegisterRnsXmlBuildProcessor(this).run((RegisterRnsRequestDto) dto);
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
