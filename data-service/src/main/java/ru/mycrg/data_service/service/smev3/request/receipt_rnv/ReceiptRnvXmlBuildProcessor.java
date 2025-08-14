package ru.mycrg.data_service.service.smev3.request.receipt_rnv;

import org.jetbrains.annotations.NotNull;
import ru.mycrg.data_service.dto.smev3.ReceiptRnvRequestDto;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.receipt_rnv_1_0_9.ReceiptExploitationType;
import ru.mycrg.data_service.receipt_rnv_1_0_9.ReceiptListExploitationType;
import ru.mycrg.data_service.receipt_rnv_1_0_9.Request;
import ru.mycrg.data_service.service.smev3.model.RequestAndSources;
import ru.mycrg.data_service.service.smev3.request.AXmlBuildProcessor;
import ru.mycrg.data_service.service.smev3.request.RequestProcessor;
import ru.mycrg.data_service.util.xml.XmlMapper;

import static java.util.Optional.ofNullable;

public class ReceiptRnvXmlBuildProcessor extends AXmlBuildProcessor {

    public ReceiptRnvXmlBuildProcessor(RequestProcessor requestProcessor) {
        super(requestProcessor);
    }

    public RequestAndSources<Request> run(@NotNull ReceiptRnvRequestDto rnvRequestDto) {
        try {
            var request = new Request();

            var permitDatOpt = ofNullable(rnvRequestDto.getPermitDate()).map(XmlMapper::mapCalendar);
            var permitDatFromOpt = ofNullable(rnvRequestDto.getPermitDateFrom()).map(XmlMapper::mapCalendar);
            var permitDatToOpt = ofNullable(rnvRequestDto.getPermitDateTo()).map(XmlMapper::mapCalendar);
            var permitNumberOpt = ofNullableString(rnvRequestDto.getPermitNumber());
            var docIdOpt = ofNullableString(rnvRequestDto.getDocId());

            // запрос списка
            if (permitDatFromOpt.isPresent() && permitDatToOpt.isPresent()) {
                var receiptListExploitationType = new ReceiptListExploitationType();
                permitDatFromOpt.ifPresent(receiptListExploitationType::setPermitDateFrom);
                permitDatToOpt.ifPresent(receiptListExploitationType::setPermitDateTo);
                request.setReceiptListExploitation(receiptListExploitationType);

                // запрос одной записи
            } else if (permitDatOpt.isPresent()) {
                var receiptExploitationType = new ReceiptExploitationType();
                permitDatOpt.ifPresent(receiptExploitationType::setPermitDate);
                request.setReceiptExploitation(receiptExploitationType);

                // запрос одной записи
            } else if (permitNumberOpt.isPresent()) {
                var receiptExploitationType = new ReceiptExploitationType();
                permitNumberOpt.ifPresent(receiptExploitationType::setPermitNumber);
                request.setReceiptExploitation(receiptExploitationType);

                // запрос одной записи
            } else if (docIdOpt.isPresent()) {
                var receiptExploitationType = new ReceiptExploitationType();
                docIdOpt.ifPresent(receiptExploitationType::setDocId);
                request.setReceiptExploitation(receiptExploitationType);
            }

            return buildRequest(request);
        } catch (Exception e) {
            throw new SmevRequestException("Ошибка при построении запрос в СМЭВ: " + e.getMessage());
        }
    }
}
