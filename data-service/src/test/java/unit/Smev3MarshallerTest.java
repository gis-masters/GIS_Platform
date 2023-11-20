package unit;

import org.junit.Test;
import ru.mycrg.data_service.config.Smev3Config;
import ru.mycrg.data_service.dto.smev3.ReceiptRnsRequestDto;
import ru.mycrg.data_service.receipt_rns_1_0_9.ClientMessage;
import ru.mycrg.data_service.service.smev3.ReceiptRnsRequestService;
import ru.mycrg.data_service.util.smev3.Smev3XmlUtils;

import java.time.LocalDate;
import java.util.UUID;

import static org.junit.Assert.assertEquals;
import static ru.mycrg.data_service.util.smev3.Smev3XmlUtils.mapLocalDate;

public class Smev3MarshallerTest {

    private ReceiptRnsRequestService receiptRnsRequestService;

    public Smev3MarshallerTest() {
        var smev3Config = new Smev3Config();
        smev3Config.setMnemonicIS("mnemonic");

        this.receiptRnsRequestService = new ReceiptRnsRequestService(smev3Config, null, null);
    }

    /**
     * urn://x-artefacts-uishc.domrf.ru/receipt-rns/1.0.9 - запрос
     */
    @Test
    public void receiptRnsRequest_1_0_9() throws Exception {
        var dto = new ReceiptRnsRequestDto();
        dto.setConstPermitDateFrom(LocalDate.of(2022, 1, 1));
        dto.setConstPermitDateTo(LocalDate.of(2022, 1, 1));

        var xmlText = receiptRnsRequestService.buildRequest(dto, UUID.randomUUID());

        var clientMessageUnmarshal = Smev3XmlUtils.unmarshall(xmlText, ClientMessage.class);

        var receiptListConstruction = clientMessageUnmarshal
                .getRequestMessage()
                .getRequestContent()
                .getContent()
                .getMessagePrimaryContent()
                .getRequest()
                .getReceiptListConstruction();

        assertEquals(dto.getConstPermitDateFrom(), mapLocalDate(receiptListConstruction.getConstPermitDateFrom()));
        assertEquals(dto.getConstPermitDateTo(), mapLocalDate(receiptListConstruction.getConstPermitDateTo()));
    }
}
