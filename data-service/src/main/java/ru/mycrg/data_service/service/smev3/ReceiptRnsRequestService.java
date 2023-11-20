package ru.mycrg.data_service.service.smev3;


import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.config.Smev3Config;
import ru.mycrg.data_service.dto.smev3.ReceiptRnsRequestDto;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.receipt_rns_1_0_9.*;
import ru.mycrg.data_service.util.smev3.Smev3XmlUtils;
import ru.mycrg.data_service_contract.dto.smev3.RequestDto;

import java.util.UUID;

import static ru.mycrg.data_service.util.smev3.Smev3XmlUtils.mapCalendar;

/**
 * urn://x-artefacts-uishc.domrf.ru/receipt-rns/1.0.9
 */
@Service
public class ReceiptRnsRequestService {
    private final Logger log = LoggerFactory.getLogger(ReceiptRnsRequestService.class);
    private final Smev3Config smev3Config;
    private final RabbitTemplate rabbitSmevAdapterTemplate;
    private final Queue adapterSendQueue;

    public ReceiptRnsRequestService(Smev3Config smev3Config, RabbitTemplate rabbitSmevAdapterTemplate, Queue adapterSendQueue) {
        this.smev3Config = smev3Config;
        this.rabbitSmevAdapterTemplate = rabbitSmevAdapterTemplate;
        this.adapterSendQueue = adapterSendQueue;
    }

    public RequestDto request(@NotNull ReceiptRnsRequestDto rnsRequestDto) {
        log.info("SMEV3 | receipt-rns/1.0.9  ConstPermitDateFrom {}  ConstPermitDateTo {}", rnsRequestDto.getConstPermitDateFrom(), rnsRequestDto.getConstPermitDateTo());
        try {
            var clientId = UUID.randomUUID();
            var xmlRequest = buildRequest(rnsRequestDto, clientId);
            rabbitSmevAdapterTemplate.convertAndSend(adapterSendQueue.getName(), xmlRequest);
            log.info("SMEV3 | Send message. ClientId: {}", clientId);
            return new RequestDto(clientId, xmlRequest);
        } catch (Exception e) {
            throw new DataServiceException("SMEV3 | Push to queue error :" + e.getMessage());
        }
    }

    public String buildRequest(@NotNull ReceiptRnsRequestDto rnsRequestDto, @NotNull UUID clientId) {
        try {
            var receiptConstruction = new ReceiptListConstructionType();
            receiptConstruction.setConstPermitDateFrom(mapCalendar(rnsRequestDto.getConstPermitDateFrom()));
            receiptConstruction.setConstPermitDateTo(mapCalendar(rnsRequestDto.getConstPermitDateTo()));

            var request = new RequestType();
            request.setReceiptListConstruction(receiptConstruction);

            var messagePrimaryContent = new MessagePrimaryContent();
            messagePrimaryContent.setRequest(request);

            var content = new Content();
            content.setMessagePrimaryContent(messagePrimaryContent);

            var requestContent = new RequestContentType();
            requestContent.setContent(content);

            var requestMetadata = new RequestMetadataType();
            requestMetadata.setClientId(clientId.toString());

            var requestMessage = new RequestMessageType();
            requestMessage.setRequestMetadata(requestMetadata);
            requestMessage.setRequestContent(requestContent);

            var clientMessage = new ClientMessage();
            clientMessage.setItSystem(smev3Config.getMnemonicIS());
            clientMessage.setRequestMessage(requestMessage);

            var requestXml = Smev3XmlUtils.marshall(clientMessage, ClientMessage.class);
            log.debug("SMEV3 | request: {}", requestXml);
            return requestXml;
        } catch (Exception e) {
            throw new DataServiceException("SMEV3 | build request error :" + e.getMessage());
        }
    }
}
