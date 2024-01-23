package ru.mycrg.data_service.service.smev3.request.receipt_rnv;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.data_service.dto.smev3.ReceiptRnvRequestDto;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.receipt_rnv_1_0_9.AttachmentHeaderType;
import ru.mycrg.data_service.receipt_rnv_1_0_9.ReceiptExploitationType;
import ru.mycrg.data_service.receipt_rnv_1_0_9.ReceiptListExploitationType;
import ru.mycrg.data_service.receipt_rnv_1_0_9.Request;
import ru.mycrg.data_service.service.smev3.RequestProcessor;
import ru.mycrg.data_service.service.smev3.model.BuildRequestAndSources;
import ru.mycrg.data_service.service.smev3.request.AXmlBuildProcess;
import ru.mycrg.data_service.util.xml.XmlMapper;

import static java.util.Optional.ofNullable;

public class ReceiptRnvXmlBuildProcess extends AXmlBuildProcess {
    private final Logger log = LoggerFactory.getLogger(ReceiptRnvXmlBuildProcess.class);

    public ReceiptRnvXmlBuildProcess(RequestProcessor requestProcessor) {
        super(requestProcessor, null, null);
    }

    public BuildRequestAndSources<Request> run(@NotNull ReceiptRnvRequestDto rnvRequestDto) {
        try {
            var request = new Request();

            var permitDatOpt = ofNullable(rnvRequestDto.getPermitDate());
            var permitDatFromOpt = ofNullable(rnvRequestDto.getPermitDateFrom());
            var permitDatToOpt = ofNullable(rnvRequestDto.getPermitDateTo());
            var permitNumberOpt = ofNullable(rnvRequestDto.getPermitNumber());
            var docIdOpt = ofNullable(rnvRequestDto.getDocId());

            // если задан PermitDate
            if (permitDatOpt.isPresent()) {
                var receiptExploitationType = new ReceiptExploitationType();
                permitDatOpt
                        .map(XmlMapper::mapCalendar)
                        .ifPresent(receiptExploitationType::setPermitDate);

                request.setReceiptExploitation(receiptExploitationType);
            } else if (permitDatFromOpt.isPresent() && permitDatToOpt.isPresent()) {
                var receiptListExploitationType = new ReceiptListExploitationType();
                permitDatFromOpt
                        .map(XmlMapper::mapCalendar)
                        .ifPresent(receiptListExploitationType::setPermitDateFrom);
                permitDatToOpt
                        .map(XmlMapper::mapCalendar)
                        .ifPresent(receiptListExploitationType::setPermitDateTo);

                request.setReceiptListExploitation(receiptListExploitationType);
            } else if (permitNumberOpt.isPresent()) {
                var receiptExploitationType = new ReceiptExploitationType();
                permitNumberOpt.ifPresent(receiptExploitationType::setPermitNumber);

                request.setReceiptExploitation(receiptExploitationType);
            } else if (docIdOpt.isPresent()) {
                var receiptExploitationType = new ReceiptExploitationType();
                docIdOpt.ifPresent(receiptExploitationType::setDocId);

                request.setReceiptExploitation(receiptExploitationType);
            }

            return buildRequest(request);
        } catch (Exception e) {
            throw new SmevRequestException("build request error :" + e.getMessage());
        }
    }
}
