package ru.mycrg.data_service.service.smev3.request.receipt_rns;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.data_service.dto.smev3.ReceiptRnsRequestDto;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.receipt_rns_1_0_9.ReceiptListConstructionType;
import ru.mycrg.data_service.receipt_rns_1_0_9.Request;
import ru.mycrg.data_service.service.smev3.model.BuildRequestAndSources;
import ru.mycrg.data_service.service.smev3.request.AXmlBuildProcess;
import ru.mycrg.data_service.service.smev3.request.RequestProcessor;

import static ru.mycrg.data_service.util.xml.XmlMapper.mapCalendar;


public class ReceiptRnsRequestXmlProcess extends AXmlBuildProcess {
    private final Logger log = LoggerFactory.getLogger(ReceiptRnsRequestXmlProcess.class);

    public ReceiptRnsRequestXmlProcess(RequestProcessor requestProcessor) {
        super(requestProcessor);
    }

    public BuildRequestAndSources<Request> run(@NotNull ReceiptRnsRequestDto rnsRequestDto) {
        try {
            var receiptConstruction = new ReceiptListConstructionType();
            receiptConstruction.setConstPermitDateFrom(mapCalendar(rnsRequestDto.getConstPermitDateFrom()));
            receiptConstruction.setConstPermitDateTo(mapCalendar(rnsRequestDto.getConstPermitDateTo()));

            var request = new Request();
            request.setReceiptListConstruction(receiptConstruction);

            return buildRequest(request);
        } catch (Exception e) {
            throw new SmevRequestException("build request error :" + e.getMessage());
        }
    }
}
