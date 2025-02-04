package ru.mycrg.data_service.service.smev3.request.terminate_rns;

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
import ru.mycrg.data_service.service.schemas.ISchemaTemplateService;
import ru.mycrg.data_service.service.smev3.Mnemonic;
import ru.mycrg.data_service.service.smev3.SmevMessageSenderService;
import ru.mycrg.data_service.service.smev3.SmevOutgoingAttachmentService;
import ru.mycrg.data_service.service.smev3.model.RequestAndSources;
import ru.mycrg.data_service.service.smev3.model.SmevRequestMeta;
import ru.mycrg.data_service.service.smev3.request.RequestProcessor;
import ru.mycrg.data_service.service.smev3.request.SmevFakeXmlBuilder;
import ru.mycrg.data_service.terminate_rns_1_0_6.*;
import ru.mycrg.data_service.util.JsonConverter;
import ru.mycrg.data_service.util.xml.XmlMarshaller;

import java.util.UUID;

/**
 * urn://x-artefacts-uishc.domrf.ru/terminate-rns/1.0.6
 */
@Service
@ConditionalOnProperty(
        value = "crg-options.integration.smev3.enabled",
        havingValue = "true",
        matchIfMissing = true)
public class TerminateRnsRequestService extends RequestProcessor {

    private final Logger log = LoggerFactory.getLogger(TerminateRnsRequestService.class);

    public TerminateRnsRequestService(SmevMessageSenderService messageService,
                                      Smev3Config smev3Config,
                                      BaseReadDao baseDao,
                                      @Qualifier("schemaTemplateServiceBase") ISchemaTemplateService schemaService,
                                      ResourceLoader resourceLoader,
                                      SmevOutgoingAttachmentService attachmentService) {
        super(Mnemonic.TERMINATE_RNS_1_0_6,
              messageService,
              baseDao,
              schemaService,
              attachmentService,
              resourceLoader,
              null,
              smev3Config);
    }

    @Override
    public SmevRequestMeta sendRequest(@NotNull ISmevRequestDto dto) {
        return super.sendRequest(dto);
    }

    @Override
    protected SmevRequestMeta buildRequest(@NotNull ISmevRequestDto dto) throws Exception {
        RegisterRequestDto terminateRequestDto = (RegisterRequestDto) dto;

        log.debug("Построение запроса terminate-rns в СМЭВ на основе ДТО: {}", dto);

        RequestAndSources<Request> requestAndSources = new TerminateRnsXmlBuildProcessor(this)
                .run(terminateRequestDto);
        ClientMessage clientMessage = clientMessage(requestAndSources);

        String xmlPartOfRequest = XmlMarshaller.marshall(clientMessage, ClientMessage.class,
                                                         mnemonicEnum().getPrefixMapper());
        if (terminateRequestDto.getFakeRequest() != null) {
            log.debug("Подменяем 🔀 RequestContent на заданный в запросе");

            xmlPartOfRequest = SmevFakeXmlBuilder.replaceRequest(xmlPartOfRequest,
                                                                 terminateRequestDto.getFakeRequest());
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

    private ClientMessage clientMessage(RequestAndSources<Request> requestAndSources) {
        Content content = new Content();

        // PrimaryContent
        MessagePrimaryContent primaryContent = new MessagePrimaryContent();
        primaryContent.setRequest(requestAndSources.getRequest());
        content.setMessagePrimaryContent(primaryContent);

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
