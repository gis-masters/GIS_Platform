package ru.mycrg.data_service.service.smev3.terminate_rns;

import org.junit.Test;
import ru.mycrg.data_service.service.smev3.Mnemonic;
import ru.mycrg.data_service.service.smev3.model.ProcessMessageStatus;
import ru.mycrg.data_service.service.smev3.request.terminate_rns.TerminateRnsResponseService;
import ru.mycrg.data_service.util.xml.XmlMarshaller;
import ru.mycrg.data_service.service.smev3.AProcessorTest;

import static org.junit.jupiter.api.Assertions.*;

public class TerminateRnsResponseTest extends AProcessorTest {
    private final String xmlPath = "terminate_rns_1_0_6";


    @Test
    public void responseSuccess() {
        //TODO необходимо получить валидный ответ из СМЭВ и сделать тест
        assertTrue(true);
    }

    @Test
    public void responseReject() throws Exception {
        var fileContent = readFile(xmlPath + "/response_reject.xml");

        //сервис для обработки пакета из СМЭВ
        var service = new TerminateRnsResponseService();

        // результат обработки
        var processResult = service.processMessageFromSmev(fileContent);

        assertNotNull(processResult);
        assertNotNull(processResult.getMessage());
        assertEquals(ProcessMessageStatus.ERROR_REJECT, processResult.getStatus());
        assertEquals(Mnemonic.TERMINATE_RNS_1_0_6, processResult.getXmlBuildMeta().getMnemonic());
        assertNotNull(processResult.getXmlBuildMeta().getClientId());
        assertNotNull(processResult.getXmlBuildMeta().getReferenceClientId());
        assertNotNull(processResult.getXmlBuildMeta().getRequestXmlString());
        assertNotNull(processResult.getXmlBuildMeta().getRequestJson());
    }

    @Test
    public void responseStatusMessage() throws Exception {
        var fileContent = readFile("technical_messages/status_message_1.xml");

        //сервис для обработки пакета из СМЭВ
        var service = new TerminateRnsResponseService();

        // результат обработки
        var processResult = service.processMessageFromSmev(fileContent);

        assertNotNull(processResult);
        assertNotNull(processResult.getMessage());
        assertEquals(ProcessMessageStatus.ERROR_STATUS, processResult.getStatus());
        assertEquals(Mnemonic.TERMINATE_RNS_1_0_6, processResult.getXmlBuildMeta().getMnemonic());
        assertNotNull(processResult.getXmlBuildMeta().getClientId());
        assertNotNull(processResult.getXmlBuildMeta().getReferenceClientId());
        assertNotNull(processResult.getXmlBuildMeta().getRequestXmlString());
        assertNotNull(processResult.getXmlBuildMeta().getRequestJson());
    }
}
