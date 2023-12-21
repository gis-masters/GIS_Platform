package unit.smev;

import org.junit.Test;
import ru.mycrg.data_service.config.Smev3Config;
import ru.mycrg.data_service.dto.smev3.ReceiptRnsRequestDto;
import ru.mycrg.data_service.receipt_rns_1_0_9.ClientMessage;
import ru.mycrg.data_service.receipt_rns_1_0_9.QueryResult;
import ru.mycrg.data_service.service.smev3.receipt_rns.ReceiptRnsXmlBuildProcess;
import ru.mycrg.data_service.service.smev3.support_classes.XmlMapper;
import ru.mycrg.data_service.service.smev3.support_classes.XmlMarshaller;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * urn://x-artefacts-uishc.domrf.ru/receipt-rns/1.0.9
 */
public class ReceiptRnsMarshallerTest extends AMarshallerTest {

    @Test
    public void request() throws Exception {
        var marshaller = new XmlMarshaller(ReceiptRnsXmlBuildProcess.namespacePrefixMapper);

        var smev3Config = new Smev3Config();
        smev3Config.setSystemMnemonic("mnemonic");

        var dto = new ReceiptRnsRequestDto();
        dto.setConstPermitDateFrom(LocalDate.of(2022, 1, 1));
        dto.setConstPermitDateTo(LocalDate.of(2022, 1, 1));

        var meta = new ReceiptRnsXmlBuildProcess(smev3Config).run(dto);

        var clientMessageUnmarshal = marshaller.unmarshall(meta.getXmlString(), ClientMessage.class);

        var receiptListConstruction = clientMessageUnmarshal
                .getRequestMessage()
                .getRequestContent()
                .getContent()
                .getMessagePrimaryContent()
                .getRequest()
                .getReceiptListConstruction();

        assertEquals(dto.getConstPermitDateFrom(), XmlMapper.mapLocalDate(receiptListConstruction.getConstPermitDateFrom()));
        assertEquals(dto.getConstPermitDateTo(), XmlMapper.mapLocalDate(receiptListConstruction.getConstPermitDateTo()));
    }

    @Test
    public void response() throws Exception {
        var marshaller = new XmlMarshaller(ReceiptRnsXmlBuildProcess.namespacePrefixMapper);
        var fileContent = readFile("receipt_rns_1_0_9/response_reject.xml");
        var queryResult = marshaller.unmarshall(fileContent, QueryResult.class);

        var smevMeta = queryResult.getSmevMetadata();
        assertEquals("549c1cbd-8e0d-11ee-bd2f-0242ac120005", smevMeta.getMessageId());
        assertEquals("18434900-f30b-48ea-90e0-9e2ef3ae40b5", smevMeta.getTransactionCode());
        assertEquals("809abbdc-8e0c-11ee-a85d-b2f0d27b6b0e", smevMeta.getOriginalMessageID());
        assertEquals("777002", smevMeta.getSender());
        assertEquals("U629301", smevMeta.getRecipient());

        var message = queryResult.getMessage();
        assertEquals("RejectMessage", message.getMessageType());
        assertEquals("RejectMessage", message.getMessageType());
    }
}
