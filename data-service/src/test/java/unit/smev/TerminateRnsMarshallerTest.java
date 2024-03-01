package unit.smev;

import org.junit.Test;
import ru.mycrg.data_service.service.smev3.Mnemonic;
import ru.mycrg.data_service.service.smev3.model.SmevMessageType;
import ru.mycrg.data_service.terminate_rns_1_0_6.QueryResult;
import ru.mycrg.data_service.util.xml.XmlMarshaller;

import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * urn://x-artefacts-uishc.domrf.ru/receipt-rnv/1.0.9
 */
public class TerminateRnsMarshallerTest extends AMarshallerTest {
    private final XmlMarshaller marshaller = new XmlMarshaller(Mnemonic.TERMINATE_RNS_1_0_6.getPrefixMapper());

    @Test
    public void responseReject() throws Exception {
        var fileContent = readFile("terminate_rns_1_0_6/response_reject.xml");
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
    }
}
