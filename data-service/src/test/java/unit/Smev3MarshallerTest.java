package unit;

import org.junit.Test;
import ru.mycrg.data_service.config.Smev3Config;
import ru.mycrg.data_service.dto.smev3.ReceiptRnsRequestDto;
import ru.mycrg.data_service.receipt_rns_1_0_9.ClientMessage;
import ru.mycrg.data_service.service.smev3.receipt_rns.ReceiptRnsXmlBuildProcess;
import ru.mycrg.data_service.service.smev3.support_classes.XmlMapper;
import ru.mycrg.data_service.service.smev3.support_classes.XmlMarshaller;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class Smev3MarshallerTest {

    /**
     * urn://x-artefacts-uishc.domrf.ru/receipt-rns/1.0.9 - запрос
     */
    @Test
    public void receiptRns_1_0_9() throws Exception {
        var marshaller = new XmlMarshaller(ReceiptRnsXmlBuildProcess.namespacePrefixMapper);

        var smev3Config = new Smev3Config();
        smev3Config.setMnemonicIS("mnemonic");

        var dto = new ReceiptRnsRequestDto();
        dto.setConstPermitDateFrom(LocalDate.of(2022, 1, 1));
        dto.setConstPermitDateTo(LocalDate.of(2022, 1, 1));

        var meta = new ReceiptRnsXmlBuildProcess(smev3Config).run(dto);

        var clientMessageUnmarshal = marshaller.unmarshall(meta.getXmlRequest(), ClientMessage.class);

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
}
