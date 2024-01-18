package ru.mycrg.data_service.service.smev3.request.receipt_rns;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.data_service.dto.smev3.ReceiptRnsRequestDto;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.receipt_rns_1_0_9.*;
import ru.mycrg.data_service.service.smev3.RequestProcessor;
import ru.mycrg.data_service.service.smev3.model.XmlBuildMeta;
import ru.mycrg.data_service.util.JsonConverter;

import java.util.UUID;

import static ru.mycrg.data_service.util.xml.XmlMapper.mapCalendar;


public class ReceiptRnsXmlBuildProcess {
    private final Logger log = LoggerFactory.getLogger(ReceiptRnsXmlBuildProcess.class);
    private final RequestProcessor requestProcessor;

    public ReceiptRnsXmlBuildProcess(RequestProcessor requestProcessor) {
        this.requestProcessor = requestProcessor;
    }

    public XmlBuildMeta run(@NotNull ReceiptRnsRequestDto rnsRequestDto) {
        UUID clientId = UUID.randomUUID();

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

            //clientId
            var requestMetadata = new RequestMetadataType();
            requestMetadata.setClientId(clientId.toString());

            var requestMessage = new RequestMessageType();
            requestMessage.setRequestMetadata(requestMetadata);
            requestMessage.setRequestContent(requestContent);

            var clientMessage = new ClientMessage();
            clientMessage.setItSystem(requestProcessor.getSmev3Config().getSystemMnemonic());
            clientMessage.setRequestMessage(requestMessage);

            String xmlText = requestProcessor
                    .xmlMarshaller()
                    .marshall(clientMessage, ClientMessage.class);

            log.debug("SMEV3. request: {}", xmlText);

            return new XmlBuildMeta(
                    requestProcessor.mnemonicEnum(),
                    clientId,
                    null,
                    JsonConverter.toJsonNode(clientMessage),
                    xmlText,
                    null,
                    null
            );
        } catch (Exception e) {
            throw new SmevRequestException("build request error :" + e.getMessage());
        }
    }
}
