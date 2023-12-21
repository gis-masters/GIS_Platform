package ru.mycrg.data_service.service.smev3.receipt_rnv;

import com.sun.xml.bind.marshaller.NamespacePrefixMapper;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.data_service.config.Smev3Config;
import ru.mycrg.data_service.dto.smev3.ReceiptRnvRequestDto;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.receipt_rnv_1_0_9.*;
import ru.mycrg.data_service.service.smev3.model.XmlBuildMeta;
import ru.mycrg.data_service.service.smev3.support_classes.XmlMarshaller;
import ru.mycrg.data_service.util.JsonConverter;

import java.util.UUID;

import static ru.mycrg.data_service.service.smev3.receipt_rnv.ReceiptRnvRequestService.MNEMONIC;
import static ru.mycrg.data_service.service.smev3.receipt_rnv.ReceiptRnvRequestService.MNEMONIC_VERSION;
import static ru.mycrg.data_service.service.smev3.support_classes.XmlMapper.mapCalendar;

public class ReceiptRnvXmlBuildProcess {

    private final Logger log = LoggerFactory.getLogger(ReceiptRnvXmlBuildProcess.class);
    private final XmlMarshaller marshaller = new XmlMarshaller(namespacePrefixMapper);
    private final Smev3Config smev3Config;
    private UUID clientId;
    private ClientMessage xmlObject;
    private String xmlText;

    public ReceiptRnvXmlBuildProcess(Smev3Config smev3Config) {
        this.smev3Config = smev3Config;
    }

    public XmlBuildMeta run(@NotNull ReceiptRnvRequestDto rnvRequestDto) {
        this.clientId = UUID.randomUUID();

        try {
            var receiptExploitationType = new ReceiptExploitationType();
            receiptExploitationType.setPermitDate(mapCalendar(rnvRequestDto.getPermitDate()));

            var request = new RequestType();
            request.setReceiptExploitation(receiptExploitationType);

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
            clientMessage.setItSystem(smev3Config.getSystemMnemonic());
            clientMessage.setRequestMessage(requestMessage);

            xmlObject = clientMessage;
            xmlText = marshaller.marshall(clientMessage, ClientMessage.class);

            log.debug("SMEV3. request: {}", xmlText);

            return new XmlBuildMeta(
                    MNEMONIC,
                    MNEMONIC_VERSION,
                    clientId,
                    null,
                    JsonConverter.toJsonNode(xmlObject),
                    xmlText,
                    null,
                    null
            );
        } catch (Exception e) {
            throw new SmevRequestException("build request error :" + e.getMessage());
        }

    }

    public static final NamespacePrefixMapper namespacePrefixMapper = new NamespacePrefixMapper() {
        @Override
        public String getPreferredPrefix(String urn, String s1, boolean b) {
            switch (urn) {
                case "urn://x-artefacts-uishc.domrf.ru/receipt-rnv/1.0.9":
                    return "tns";
                case "urn://x-artefacts-uishc.domrf.ru/receipt-rnv/commons/1.0.9":
                    return "com";
                case "urn://x-artefacts-smev-gov-ru/supplementary/commons/1.3.0":
                    return "smev";
                default:
                    return "typ";
            }
        }
    };
}
