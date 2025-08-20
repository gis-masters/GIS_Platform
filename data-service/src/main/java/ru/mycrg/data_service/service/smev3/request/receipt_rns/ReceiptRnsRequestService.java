package ru.mycrg.data_service.service.smev3.request.receipt_rns;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.service.smev3.config.Smev3Config;
import ru.mycrg.data_service.dto.smev3.ISmevRequestDto;
import ru.mycrg.data_service.dto.smev3.ReceiptRnsRequestDto;
import ru.mycrg.data_service.receipt_rns_1_0_9.*;
import ru.mycrg.data_service.service.smev3.Mnemonic;
import ru.mycrg.data_service.service.smev3.SmevMessageSenderService;
import ru.mycrg.data_service.service.smev3.model.RequestAndSources;
import ru.mycrg.data_service.service.smev3.model.SmevRequestMeta;
import ru.mycrg.data_service.service.smev3.request.RequestProcessor;
import ru.mycrg.data_service.util.JsonConverter;
import ru.mycrg.data_service.util.xml.XmlMarshaller;

import java.util.UUID;

/**
 * urn://x-artefacts-uishc.domrf.ru/receipt-rns/1.0.9
 */
@Service
@ConditionalOnProperty(
        value = "crg-options.integration.smev3.enabled",
        havingValue = "true",
        matchIfMissing = true)
public class ReceiptRnsRequestService extends RequestProcessor {

    private final Logger log = LoggerFactory.getLogger(ReceiptRnsRequestService.class);

    public ReceiptRnsRequestService(Smev3Config smev3Config,
                                    ResourceLoader resourceLoader,
                                    SmevMessageSenderService messageService) {
        super(Mnemonic.RECEIPT_RNS_1_0_9, messageService, resourceLoader, smev3Config);
    }

    @Override
    public SmevRequestMeta sendRequest(@NotNull ISmevRequestDto dto) {
        return super.sendRequest(dto);
    }

    @Override
    protected SmevRequestMeta buildRequest(@NotNull ISmevRequestDto dto) throws Exception {
        log.debug("Построение запроса receipt-rns в СМЭВ на основе ДТО: {}", dto);

        RequestAndSources<Request> requestAndSources = new ReceiptRnsRequestXmlProcessor(this)
                .run((ReceiptRnsRequestDto) dto);
        ClientMessage clientMessage = clientMessage(requestAndSources.getRequest());
        SmevRequestMeta meta = new SmevRequestMeta(
                mnemonicEnum(),
                UUID.fromString(clientMessage.getRequestMessage().getRequestMetadata().getClientId()),
                null,
                XmlMarshaller.marshall(clientMessage, ClientMessage.class, mnemonicEnum().getPrefixMapper()),
                JsonConverter.toJsonNode(clientMessage),
                requestAndSources.getSourcesAsJson(),
                requestAndSources.getAttachmentsAsJson());

        validate(meta, requestAndSources.getRequest(), Request.class);

        return meta;
    }

    private ClientMessage clientMessage(Request request) {
        MessagePrimaryContent primaryContent = new MessagePrimaryContent();
        primaryContent.setRequest(request);

        Content content = new Content();
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
