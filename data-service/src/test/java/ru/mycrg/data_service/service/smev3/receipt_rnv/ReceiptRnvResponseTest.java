package ru.mycrg.data_service.service.smev3.receipt_rnv;

import org.junit.Test;
import ru.mycrg.data_service.receipt_rnv_1_0_9.QueryResult;
import ru.mycrg.data_service.service.smev3.Mnemonic;
import ru.mycrg.data_service.service.smev3.model.ProcessMessageStatus;
import ru.mycrg.data_service.service.smev3.request.receipt_rnv.ReceiptRnvResponseService;
import ru.mycrg.data_service.util.xml.XmlMapper;
import ru.mycrg.data_service.util.xml.XmlMarshaller;
import ru.mycrg.data_service.service.smev3.AProcessorTest;
import ru.mycrg.data_service.service.smev3.DataEisZsServiceMock;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static ru.mycrg.data_service.service.smev3.fields.FieldsEisZs.*;

/**
 * urn://x-artefacts-uishc.domrf.ru/receipt-rnv/1.0.9
 */
public class ReceiptRnvResponseTest extends AProcessorTest {
    private final String xmlPath = "receipt_rnv_1_0_9";

    @Test
    public void responseConstruction() throws Exception {
        var fileContent = readFile("receipt_rnv_1_0_9/response_exploitation.xml");

        // стаб сервиса, который должен сохранить запись в БД
        var dataEisZsServiceMock = new DataEisZsServiceMock();

        //сервис для обработки пакета из СМЭВ
        var service = new ReceiptRnvResponseService(dataEisZsServiceMock);

        // результат обработки
        var processResult = service.processMessageFromSmev(fileContent);

        assertNotNull(processResult);
        assertNotNull(processResult.getMessage());
        assertEquals(ProcessMessageStatus.SUCCESSFULLY, processResult.getStatus());
        assertEquals(Mnemonic.RECEIPT_RNV_1_0_9, processResult.getXmlBuildMeta().getMnemonic());
        assertNotNull(processResult.getXmlBuildMeta().getClientId());
        assertNotNull(processResult.getXmlBuildMeta().getReferenceClientId());
        assertNotNull(processResult.getXmlBuildMeta().getRequestXmlString());
        assertNotNull(processResult.getXmlBuildMeta().getRequestJson());
    }

    @Test
    public void responseExploitation() throws Exception {
        var fileContent = readFile(xmlPath + "/response_exploitation.xml");

        // стаб сервиса, который должен сохранить запись в БД
        var dataEisZsServiceMock = new DataEisZsServiceMock();

        //сервис для обработки пакета из СМЭВ
        var service = new ReceiptRnvResponseService(dataEisZsServiceMock);

        // результат обработки
        var processResult = service.processMessageFromSmev(fileContent);

        assertNotNull(processResult);
        assertNotNull(processResult.getMessage());
        assertEquals(ProcessMessageStatus.SUCCESSFULLY, processResult.getStatus());
        assertEquals(Mnemonic.RECEIPT_RNV_1_0_9, processResult.getXmlBuildMeta().getMnemonic());
        assertNotNull(processResult.getXmlBuildMeta().getClientId());
        assertNotNull(processResult.getXmlBuildMeta().getReferenceClientId());
        assertNotNull(processResult.getXmlBuildMeta().getRequestXmlString());
        assertNotNull(processResult.getXmlBuildMeta().getRequestJson());

        // объект, который будет сохранен в БД
        var content = dataEisZsServiceMock.getContent().get(0);

        // Получаем объект из XML для дальнейшего сравнения
        var response = XmlMarshaller.unmarshall(fileContent, QueryResult.class)
                .getMessage()
                .getResponseContent()
                .getContent()
                .getMessagePrimaryContent()
                .getResponse();

        // ExploitationType
        var exploitationType = response.getResponseExploitation();

        assertEquals(content.get(PROPERTY_IS_RECORD_FULL), true);
        assertEquals(content.get(PROPERTY_PERMIT_NUMBER), exploitationType.getPermitNumber());
        assertEquals(content.get(PROPERTY_PERMIT_DATE), XmlMapper.mapLocalDateTime(exploitationType.getPermitDate()));
    }

    @Test
    public void responseListExploitation() throws Exception {
        var fileContent = readFile(xmlPath + "/response_list_exploitation.xml");

        // стаб сервиса, который должен сохранить запись в БД
        var dataEisZsServiceMock = new DataEisZsServiceMock();

        //сервис для обработки пакета из СМЭВ
        var service = new ReceiptRnvResponseService(dataEisZsServiceMock);

        // результат обработки
        var processResult = service.processMessageFromSmev(fileContent);

        assertNotNull(processResult);
        assertNotNull(processResult.getMessage());
        assertEquals(ProcessMessageStatus.SUCCESSFULLY, processResult.getStatus());
        assertEquals(Mnemonic.RECEIPT_RNV_1_0_9, processResult.getXmlBuildMeta().getMnemonic());
        assertNotNull(processResult.getXmlBuildMeta().getClientId());
        assertNotNull(processResult.getXmlBuildMeta().getReferenceClientId());
        assertNotNull(processResult.getXmlBuildMeta().getRequestXmlString());
        assertNotNull(processResult.getXmlBuildMeta().getRequestJson());

        // объект, который будет сохранен в БД
        var records = dataEisZsServiceMock.getContent();

        // size
        assertEquals(8, records.size());

        // Первое сообщение
        var content = records.get(0);
        assertEquals(content.get(PROPERTY_IS_RECORD_FULL), false);
    }

    @Test
    public void responseReject() throws Exception {
        var fileContent = readFile(xmlPath + "/response_reject.xml");

        // стаб сервиса, который должен сохранить запись в БД
        var dataEisZsServiceMock = new DataEisZsServiceMock();

        //сервис для обработки пакета из СМЭВ
        var service = new ReceiptRnvResponseService(dataEisZsServiceMock);

        // результат обработки
        var processResult = service.processMessageFromSmev(fileContent);

        assertNotNull(processResult);
        assertNotNull(processResult.getMessage());
        assertEquals(ProcessMessageStatus.ERROR_REJECT, processResult.getStatus());
        assertEquals(Mnemonic.RECEIPT_RNV_1_0_9, processResult.getXmlBuildMeta().getMnemonic());
        assertNotNull(processResult.getXmlBuildMeta().getClientId());
        assertNotNull(processResult.getXmlBuildMeta().getReferenceClientId());
        assertNotNull(processResult.getXmlBuildMeta().getRequestXmlString());
        assertNotNull(processResult.getXmlBuildMeta().getRequestJson());
    }

    @Test
    public void responseStatusMessage() throws Exception {
        var fileContent = readFile("technical_messages/status_message_1.xml");

        // стаб сервиса, который должен сохранить запись в БД
        var dataEisZsServiceMock = new DataEisZsServiceMock();

        //сервис для обработки пакета из СМЭВ
        var service = new ReceiptRnvResponseService(dataEisZsServiceMock);

        // результат обработки
        var processResult = service.processMessageFromSmev(fileContent);

        assertNotNull(processResult);
        assertNotNull(processResult.getMessage());
        assertEquals(ProcessMessageStatus.ERROR_STATUS, processResult.getStatus());
        assertEquals(Mnemonic.RECEIPT_RNV_1_0_9, processResult.getXmlBuildMeta().getMnemonic());
        assertNotNull(processResult.getXmlBuildMeta().getClientId());
        assertNotNull(processResult.getXmlBuildMeta().getReferenceClientId());
        assertNotNull(processResult.getXmlBuildMeta().getRequestXmlString());
        assertNotNull(processResult.getXmlBuildMeta().getRequestJson());
    }
}
