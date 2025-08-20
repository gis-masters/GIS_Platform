package ru.mycrg.data_service.service.smev3.receipt_rns;

import org.junit.Test;
import ru.mycrg.data_service.service.smev3.config.Smev3Config;
import ru.mycrg.data_service.dto.smev3.ReceiptRnsRequestDto;
import ru.mycrg.data_service.receipt_rns_1_0_9.Request;
import ru.mycrg.data_service.service.smev3.Mnemonic;
import ru.mycrg.data_service.service.smev3.request.receipt_rns.ReceiptRnsRequestService;
import ru.mycrg.data_service.service.smev3.request.receipt_rns.ReceiptRnsRequestXmlProcessor;
import ru.mycrg.data_service.util.xml.XmlMapper;
import ru.mycrg.data_service.util.xml.XmlMarshaller;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * urn://x-artefacts-uishc.domrf.ru/receipt-rns/1.0.9
 */
public class ReceiptRnsRequestTest {

    @Test
    public void request() throws Exception {
        var smev3Config = new Smev3Config();
        smev3Config.setSystemMnemonic("mnemonic");

        var processor = new ReceiptRnsRequestService(smev3Config, null, null);

        var dto = new ReceiptRnsRequestDto();
        dto.setConstPermitDateFrom(LocalDate.of(2022, 1, 1));
        dto.setConstPermitDateTo(LocalDate.of(2022, 1, 1));

        var meta = new ReceiptRnsRequestXmlProcessor(processor).run(dto);

        // to xml
        var requestXmlStrong = XmlMarshaller.marshall(meta.getRequest(), Request.class,
                                                   Mnemonic.RECEIPT_RNS_1_0_9.getPrefixMapper());

        // to object
        var requestObject = XmlMarshaller.unmarshall(requestXmlStrong, Request.class);

        var receiptListConstruction = requestObject.getReceiptListConstruction();

        assertEquals(dto.getConstPermitDateFrom(), XmlMapper.mapLocalDate(receiptListConstruction.getConstPermitDateFrom()));
        assertEquals(dto.getConstPermitDateTo(), XmlMapper.mapLocalDate(receiptListConstruction.getConstPermitDateTo()));
    }

}
