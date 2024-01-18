package unit.smev;

import org.junit.Test;
import ru.mycrg.data_service.register_rnv_1_0_8.QueryResult;
import ru.mycrg.data_service.service.smev3.MnemonicEnum;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class RegisterRnvMarshallerTest extends AMarshallerTest {

    @Test
    public void response() throws Exception {
        var fileContent = readFile("register_rnv_1_0_8/response_reject.xml");
        var queryResult = MnemonicEnum
                .REGISTER_RNV_1_0_8
                .getMarshaller()
                .unmarshall(fileContent, QueryResult.class);

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
