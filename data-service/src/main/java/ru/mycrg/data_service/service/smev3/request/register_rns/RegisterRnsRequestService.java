package ru.mycrg.data_service.service.smev3.request.register_rns;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.service.smev3.config.Smev3Config;
import ru.mycrg.data_service.dao.BaseReadDao;
import ru.mycrg.data_service.dto.smev3.ISmevRequestDto;
import ru.mycrg.data_service.dto.smev3.RegisterRequestDto;
import ru.mycrg.data_service.register_rns_1_0_10.*;
import ru.mycrg.data_service.repository.FileRepository;
import ru.mycrg.data_service.service.schemas.ISchemaTemplateService;
import ru.mycrg.data_service.service.smev3.Mnemonic;
import ru.mycrg.data_service.service.smev3.SmevMessageSenderService;
import ru.mycrg.data_service.service.smev3.SmevOutgoingAttachmentService;
import ru.mycrg.data_service.service.smev3.model.RequestAndSources;
import ru.mycrg.data_service.service.smev3.model.SmevRequestMeta;
import ru.mycrg.data_service.service.smev3.request.RequestProcessor;
import ru.mycrg.data_service.service.smev3.request.SmevFakeXmlBuilder;
import ru.mycrg.data_service.util.JsonConverter;
import ru.mycrg.data_service.util.xml.XmlMarshaller;

import javax.xml.bind.JAXBException;
import java.util.List;
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
                                     FileRepository fileRepository,
                                     SmevOutgoingAttachmentService attachmentService) {
        super(Mnemonic.REGISTER_RNS_1_0_10,
              messageService,
              baseReadDao,
              schemaService,
              attachmentService,
              resourceLoader,
              fileRepository,
              smev3Config);
    }

    @Override
    public SmevRequestMeta sendRequest(@NotNull ISmevRequestDto dto) {
        return super.sendRequest(dto);
    }

    @Override
    protected SmevRequestMeta buildRequest(@NotNull ISmevRequestDto dto) throws JAXBException {
        RegisterRequestDto registerRequestDto = (RegisterRequestDto) dto;

        log.debug("Построение запроса register-rns в СМЭВ на основе ДТО: {}", dto);

        RequestAndSources<Request> requestAndSources = new RegisterRnsXmlBuildProcessor(this)
                .run(registerRequestDto);
        ClientMessage clientMessage = prepareClientMessage(requestAndSources);

        String xmlPartOfRequest = XmlMarshaller.marshall(clientMessage, ClientMessage.class,
                                                         mnemonicEnum().getPrefixMapper());
        if (registerRequestDto.getFakeRequest() != null) {
            log.debug("Подменяем 🔀 RequestContent на заданный в запросе");

            xmlPartOfRequest = SmevFakeXmlBuilder.replaceRequest(xmlPartOfRequest,
                                                                 registerRequestDto.getFakeRequest());
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
        Content content = new Content();

        // PrimaryContent
        MessagePrimaryContent primaryContent = new MessagePrimaryContent();
        primaryContent.setRequest(requestAndSources.getRequest());
        content.setMessagePrimaryContent(primaryContent);

        // AttachmentHeaderList
        List<AttachmentHeaderType> attachmentHeaderTypeList = requestAndSources
                .getAttachments()
                .values().stream()
                .map(smevAttachment -> {
                    var type = new AttachmentHeaderType();
                    type.setId(smevAttachment.getAttachmentId().toString());
                    type.setFilePath(smevAttachment.getS3fileName());

                    return type;
                })
                .collect(Collectors.toList());

        if (!attachmentHeaderTypeList.isEmpty()) {
            AttachmentHeaderList attachmentHeaderList = new AttachmentHeaderList();
            attachmentHeaderList.getAttachmentHeader().addAll(attachmentHeaderTypeList);
            content.setAttachmentHeaderList(attachmentHeaderList);
        }

        RequestContentType contentType = new RequestContentType();
        contentType.setContent(content);

        RequestMetadataType metadataType = new RequestMetadataType();
        metadataType.setClientId(UUID.randomUUID().toString());

        RequestMessageType messageType = new RequestMessageType();
        messageType.setRequestMetadata(metadataType);
        messageType.setRequestContent(contentType);

        ClientMessage clientMessage = new ClientMessage();
        clientMessage.setItSystem(getSmev3Config().getSystemMnemonic());
        clientMessage.setRequestMessage(messageType);

        return clientMessage;
    }
}
