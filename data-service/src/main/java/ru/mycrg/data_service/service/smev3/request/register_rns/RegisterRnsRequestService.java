package ru.mycrg.data_service.service.smev3.request.register_rns;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.config.Smev3Config;
import ru.mycrg.data_service.dao.BaseReadDao;
import ru.mycrg.data_service.dto.smev3.ISmevRequestDto;
import ru.mycrg.data_service.dto.smev3.RegisterRnsRequestDto;
import ru.mycrg.data_service.register_rns_1_0_10.*;
import ru.mycrg.data_service.service.schemas.ISchemaTemplateService;
import ru.mycrg.data_service.service.smev3.Mnemonic;
import ru.mycrg.data_service.service.smev3.SmevMessageSenderService;
import ru.mycrg.data_service.service.smev3.SmevOutgoingAttachmentService;
import ru.mycrg.data_service.service.smev3.model.RequestAndSources;
import ru.mycrg.data_service.service.smev3.model.SmevRequestMeta;
import ru.mycrg.data_service.service.smev3.request.RequestProcessor;
import ru.mycrg.data_service.service.smev3.request.SmevFakeXmlBuilder;
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

    private final Logger log = LoggerFactory.getLogger(RegisterRnsRequestService.class);

    public RegisterRnsRequestService(Smev3Config smev3Config,
                                     BaseReadDao baseReadDao,
                                     @Qualifier("schemaTemplateServiceBase") ISchemaTemplateService schemaService,
                                     ResourceLoader resourceLoader,
                                     SmevMessageSenderService messageService,
                                     SmevOutgoingAttachmentService attachmentService) {
        super(Mnemonic.REGISTER_RNS_1_0_10, messageService, baseReadDao, schemaService, attachmentService,
              resourceLoader, smev3Config);
    }

    @Override
    public SmevRequestMeta sendRequest(@NotNull ISmevRequestDto dto) {
        return super.sendRequest(dto);
    }

    @Override
    protected SmevRequestMeta buildRequest(@NotNull ISmevRequestDto dto) throws Exception {
        RegisterRnsRequestDto registerRnsRequestDto = (RegisterRnsRequestDto) dto;

        log.debug("Построение запроса register-rns в СМЭВ на основе ДТО: {}", dto);

        RequestAndSources<Request> requestAndSources = new RegisterRnsXmlBuildProcessor(this)
                .run(registerRnsRequestDto);
        ClientMessage clientMessage = prepareClientMessage(requestAndSources);

        String xmlPartOfRequest = xmlMarshaller().marshall(clientMessage, ClientMessage.class);
        if (registerRnsRequestDto.getFakeRequest() != null) {
            log.debug("Подменяем 🔀 RequestContent на заданный в запросе");

            xmlPartOfRequest = SmevFakeXmlBuilder.replaceRequest(xmlPartOfRequest,
                                                                 registerRnsRequestDto.getFakeRequest());
        }

        SmevRequestMeta meta = new SmevRequestMeta(
                mnemonicEnum(),
                UUID.fromString(clientMessage.getRequestMessage().getRequestMetadata().getClientId()),
                null,
                xmlPartOfRequest,
                JsonConverter.toJsonNode(clientMessage),
                requestAndSources.getSourcesAsJson(),
                requestAndSources.getAttachmentsAsJson());

        validate(meta, requestAndSources.getRequest(), Request.class);

        return meta;
    }

    private ClientMessage prepareClientMessage(RequestAndSources<Request> requestAndSources) {
        var content = new Content();

        // PrimaryContent
        var primaryContent = new MessagePrimaryContent();
        primaryContent.setRequest(requestAndSources.getRequest());
        content.setMessagePrimaryContent(primaryContent);

        // AttachmentHeaderList
        var attachmentHeaderTypeList = requestAndSources
                .getAttachments()
                .values().stream()
                .map(smevAttachment -> {
                    var type = new AttachmentHeaderType();
                    type.setId(
                            smevAttachment.getAttachmentId().toString());
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
