package ru.mycrg.data_service.service.smev3.request.receipt_rns;


import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.config.Smev3Config;
import ru.mycrg.data_service.dto.smev3.ISmevRequestDto;
import ru.mycrg.data_service.dto.smev3.ReceiptRnsRequestDto;
import ru.mycrg.data_service.receipt_rns_1_0_9.*;
import ru.mycrg.data_service.service.smev3.Mnemonic;
import ru.mycrg.data_service.service.smev3.SmevMessageSenderService;
import ru.mycrg.data_service.service.smev3.model.XmlBuildMeta;
import ru.mycrg.data_service.service.smev3.request.RequestProcessor;
import ru.mycrg.data_service.util.JsonConverter;

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
        super(Mnemonic.RECEIPT_RNS_1_0_9, messageService, null, null, null, resourceLoader, smev3Config);
    }

    @Override
    protected XmlBuildMeta buildRequest(@NotNull ISmevRequestDto dto) throws Exception {
        log.debug("build xml request " + dto);

        var buildRequest = new ReceiptRnsRequestXmlProcess(this).run((ReceiptRnsRequestDto) dto);
        var clientMessage = clientMessage(buildRequest.getRequest());
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
