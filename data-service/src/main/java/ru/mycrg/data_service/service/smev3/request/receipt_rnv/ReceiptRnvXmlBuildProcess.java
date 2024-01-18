package ru.mycrg.data_service.service.smev3.request.receipt_rnv;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.data_service.dto.smev3.ReceiptRnvRequestDto;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.receipt_rnv_1_0_9.*;
import ru.mycrg.data_service.service.smev3.RequestProcessor;
import ru.mycrg.data_service.service.smev3.model.XmlBuildMeta;
import ru.mycrg.data_service.util.JsonConverter;
import ru.mycrg.data_service.util.xml.XmlMapper;

import java.util.UUID;

import static java.util.Optional.ofNullable;

public class ReceiptRnvXmlBuildProcess {
    private final Logger log = LoggerFactory.getLogger(ReceiptRnvXmlBuildProcess.class);
    private final RequestProcessor requestProcessor;

    public ReceiptRnvXmlBuildProcess(RequestProcessor requestProcessor) {
        this.requestProcessor = requestProcessor;
    }

    public XmlBuildMeta run(@NotNull ReceiptRnvRequestDto rnvRequestDto) {
        UUID clientId = UUID.randomUUID();

        try {
            var request = new RequestType();

            var permitDatOpt = ofNullable(rnvRequestDto.getPermitDate());
            var permitDatFromOpt = ofNullable(rnvRequestDto.getPermitDateFrom());
            var permitDatToOpt = ofNullable(rnvRequestDto.getPermitDateTo());
            var permitNumberOpt = ofNullable(rnvRequestDto.getPermitNumber());
            var docIdOpt = ofNullable(rnvRequestDto.getDocId());

            // если задан PermitDate
            if (permitDatOpt.isPresent()) {
                var receiptExploitationType = new ReceiptExploitationType();
                permitDatOpt
                        .map(XmlMapper::mapCalendar)
                        .ifPresent(receiptExploitationType::setPermitDate);

                request.setReceiptExploitation(receiptExploitationType);
            } else if (permitDatFromOpt.isPresent() && permitDatToOpt.isPresent()) {
                var receiptListExploitationType = new ReceiptListExploitationType();
                permitDatFromOpt
                        .map(XmlMapper::mapCalendar)
                        .ifPresent(receiptListExploitationType::setPermitDateFrom);
                permitDatToOpt
                        .map(XmlMapper::mapCalendar)
                        .ifPresent(receiptListExploitationType::setPermitDateTo);

                request.setReceiptListExploitation(receiptListExploitationType);
            } else if (permitNumberOpt.isPresent()) {
                var receiptExploitationType = new ReceiptExploitationType();
                permitNumberOpt.ifPresent(receiptExploitationType::setPermitNumber);

                request.setReceiptExploitation(receiptExploitationType);
            } else if (docIdOpt.isPresent()) {
                var receiptExploitationType = new ReceiptExploitationType();
                docIdOpt.ifPresent(receiptExploitationType::setDocId);

                request.setReceiptExploitation(receiptExploitationType);
            }


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
