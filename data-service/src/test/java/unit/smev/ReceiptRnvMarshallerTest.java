package unit.smev;

import org.junit.Test;
import ru.mycrg.data_service.receipt_rnv_1_0_9.QueryResult;
import ru.mycrg.data_service.service.smev3.Mnemonic;
import ru.mycrg.data_service.service.smev3.model.SmevMessageType;
import ru.mycrg.data_service.util.xml.XmlMarshaller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

/**
 * urn://x-artefacts-uishc.domrf.ru/receipt-rnv/1.0.9
 */
public class ReceiptRnvMarshallerTest extends AMarshallerTest {
    private final XmlMarshaller marshaller = new XmlMarshaller(Mnemonic.RECEIPT_RNV_1_0_9.getPrefixMapper());

    @Test
    public void response_ResponseListExploitation() throws Exception {
        var fileContent = readFile("receipt_rnv_1_0_9/response_list_exploitation.xml");
        var queryResult = marshaller.unmarshall(fileContent, QueryResult.class);

        assertNotNull(queryResult);

        // messageType
        var messageType = SmevMessageType.parseFromSmevValue(queryResult.getMessage().getMessageType());
        assertEquals(SmevMessageType.PRIMARY, messageType);

        var response = queryResult
                .getMessage()
                .getResponseContent()
                .getContent()
                .getMessagePrimaryContent()
                .getResponse();

        // size
        assertEquals(8, response.getResponseListExploitation().size());
    }

    @Test
    public void responseReject() throws Exception {
        var fileContent = readFile("receipt_rnv_1_0_9/response_reject.xml");
        var queryResult = marshaller.unmarshall(fileContent, QueryResult.class);

        // messageType
        var messageType = SmevMessageType.parseFromSmevValue(queryResult.getMessage().getMessageType());
        assertEquals(SmevMessageType.REJECT, messageType);

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
