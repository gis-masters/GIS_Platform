package ru.mycrg.data_service.service.smev3.receipt_rnv;

import org.junit.Test;
import ru.mycrg.data_service.service.smev3.config.Smev3Config;
import ru.mycrg.data_service.dto.smev3.ReceiptRnvRequestDto;
import ru.mycrg.data_service.receipt_rnv_1_0_9.Request;
import ru.mycrg.data_service.service.smev3.Mnemonic;
import ru.mycrg.data_service.service.smev3.request.receipt_rnv.ReceiptRnvRequestService;
import ru.mycrg.data_service.service.smev3.request.receipt_rnv.ReceiptRnvXmlBuildProcessor;
import ru.mycrg.data_service.util.xml.XmlMapper;
import ru.mycrg.data_service.util.xml.XmlMarshaller;
import ru.mycrg.data_service.service.smev3.AProcessorTest;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class ReceiptRnvRequestTest extends AProcessorTest {

    @Test
    public void request() throws Exception {
        var smev3Config = new Smev3Config();
        smev3Config.setSystemMnemonic("mnemonic");

        var processor = new ReceiptRnvRequestService(smev3Config, null, null);

        var dto = new ReceiptRnvRequestDto();
        dto.setPermitDateFrom(LocalDate.of(2022, 1, 1));
        dto.setPermitDateTo(LocalDate.of(2022, 1, 1));

        var meta = new ReceiptRnvXmlBuildProcessor(processor).run(dto);

        // to xml
        var requestXmlStrong = XmlMarshaller.marshall(meta.getRequest(), Request.class,
                                          Mnemonic.RECEIPT_RNV_1_0_9.getPrefixMapper());

        // to object
        var requestObject = XmlMarshaller.unmarshall(requestXmlStrong, Request.class);

        var receiptListConstruction = requestObject.getReceiptListExploitation();

        assertEquals(dto.getPermitDateFrom(), XmlMapper.mapLocalDate(receiptListConstruction.getPermitDateFrom()));
        assertEquals(dto.getPermitDateTo(), XmlMapper.mapLocalDate(receiptListConstruction.getPermitDateTo()));
    }

}
