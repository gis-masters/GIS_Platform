package unit.smev;

import org.junit.Test;
import ru.mycrg.data_service.config.Smev3Config;
import ru.mycrg.data_service.dto.smev3.ReceiptRnvRequestDto;
import ru.mycrg.data_service.receipt_rnv_1_0_9.QueryResult;
import ru.mycrg.data_service.receipt_rnv_1_0_9.Request;
import ru.mycrg.data_service.service.smev3.Mnemonic;
import ru.mycrg.data_service.service.smev3.model.SmevMessageType;
import ru.mycrg.data_service.service.smev3.request.receipt_rnv.ReceiptRnvRequestService;
import ru.mycrg.data_service.service.smev3.request.receipt_rnv.ReceiptRnvResponseXmlProcessor;
import ru.mycrg.data_service.service.smev3.request.receipt_rnv.ReceiptRnvXmlBuildProcessor;
import ru.mycrg.data_service.util.xml.XmlMapper;
import ru.mycrg.data_service.util.xml.XmlMarshaller;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static ru.mycrg.data_service.service.smev3.fields.FieldsEisZs.*;

/**
 * urn://x-artefacts-uishc.domrf.ru/receipt-rnv/1.0.9
 */
public class ReceiptRnvMarshallerTest extends AMarshallerTest {
    private final XmlMarshaller marshaller = new XmlMarshaller(Mnemonic.RECEIPT_RNV_1_0_9.getPrefixMapper());

    @Test
    public void request() throws Exception {
        var smev3Config = new Smev3Config();
        smev3Config.setSystemMnemonic("mnemonic");

        var processor = new ReceiptRnvRequestService(smev3Config, null, null, null);

        var dto = new ReceiptRnvRequestDto();
        dto.setPermitDateFrom(LocalDate.of(2022, 1, 1));
        dto.setPermitDateTo(LocalDate.of(2022, 1, 1));

        var meta = new ReceiptRnvXmlBuildProcessor(processor).run(dto);

        // to xml
        var requestXmlStrong = marshaller.marshall(meta.getRequest(), Request.class);

        // to object
        var requestObject = marshaller.unmarshall(requestXmlStrong, Request.class);

        var receiptListConstruction = requestObject.getReceiptListExploitation();

        assertEquals(dto.getPermitDateFrom(), XmlMapper.mapLocalDate(receiptListConstruction.getPermitDateFrom()));
        assertEquals(dto.getPermitDateTo(), XmlMapper.mapLocalDate(receiptListConstruction.getPermitDateTo()));
    }

    @Test
    public void responseExploitation() throws Exception {
        var fileContent = readFile("receipt_rnv_1_0_9/response_exploitation.xml");
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

        var record = new ReceiptRnvResponseXmlProcessor()
                .processOne(response.getResponseExploitation());

        // ExploitationType
        var exploitationType = response.getResponseExploitation();

        var content = record.getContent();
        assertEquals(content.get(PROPERTY_IS_RECORD_FULL), true);
        assertEquals(content.get(PROPERTY_PERMIT_NUMBER), exploitationType.getPermitNumber());
        assertEquals(content.get(PROPERTY_PERMIT_DATE), XmlMapper.mapLocalDateTime(exploitationType.getPermitDate()));
    }

    @Test
    public void responseListExploitation() throws Exception {
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

        var records = new ReceiptRnvResponseXmlProcessor()
                .processList(response.getResponseListExploitation());

        // size
        assertEquals(8, records.size());

        // Первое сообщение
        var content = records.get(0).getContent();
        assertEquals(content.get(PROPERTY_IS_RECORD_FULL), false);
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
