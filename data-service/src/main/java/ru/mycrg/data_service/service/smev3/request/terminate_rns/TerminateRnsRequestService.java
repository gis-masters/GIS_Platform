package ru.mycrg.data_service.service.smev3.request.terminate_rns;

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
import ru.mycrg.data_service.dto.smev3.TerminateRnsRequestDto;
import ru.mycrg.data_service.service.schemas.ISchemaTemplateService;
import ru.mycrg.data_service.service.smev3.Mnemonic;
import ru.mycrg.data_service.service.smev3.SmevMessageSenderService;
import ru.mycrg.data_service.service.smev3.SmevOutgoingAttachmentService;
import ru.mycrg.data_service.service.smev3.model.RequestAndSources;
import ru.mycrg.data_service.service.smev3.model.SmevRequestMeta;
import ru.mycrg.data_service.service.smev3.request.RequestProcessor;
import ru.mycrg.data_service.terminate_rns_1_0_6.*;
import ru.mycrg.data_service.util.JsonConverter;

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
        log.debug("Построение запроса terminate-rns в СМЭВ на основе ДТО: {}", dto);

        var buildRequest = new TerminateRnsXmlBuildProcessor(this).run((TerminateRnsRequestDto) dto);
        var clientMessage = clientMessage(buildRequest);
        var meta = new SmevRequestMeta(
                mnemonicEnum(),
                UUID.fromString(clientMessage.getRequestMessage().getRequestMetadata().getClientId()),
                null,
                xmlMarshaller().marshall(clientMessage, ClientMessage.class),
                JsonConverter.toJsonNode(clientMessage),
                buildRequest.getSourcesAsJson(),
                buildRequest.getAttachmentsAsJson()
        );

        validate(meta, buildRequest.getRequest(), Request.class);

        return meta;
    }

    private ClientMessage clientMessage(RequestAndSources<Request> requestAndSources) {
        var content = new Content();

        // PrimaryContent
        var primaryContent = new MessagePrimaryContent();
        primaryContent.setRequest(requestAndSources.getRequest());
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
