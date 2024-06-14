package ru.mycrg.data_service.service.smev3.request.receipt_rns;

import org.jetbrains.annotations.NotNull;
import ru.mycrg.data_service.dto.smev3.ReceiptRnsRequestDto;
import ru.mycrg.data_service.exceptions.SmevRequestException;
import ru.mycrg.data_service.receipt_rns_1_0_9.ReceiptConstructionType;
import ru.mycrg.data_service.receipt_rns_1_0_9.ReceiptListConstructionType;
import ru.mycrg.data_service.receipt_rns_1_0_9.Request;
import ru.mycrg.data_service.service.smev3.model.RequestAndSources;
import ru.mycrg.data_service.service.smev3.request.AXmlBuildProcessor;
import ru.mycrg.data_service.service.smev3.request.RequestProcessor;
import ru.mycrg.data_service.util.xml.XmlMapper;

import static java.util.Optional.ofNullable;

public class ReceiptRnsRequestXmlProcessor extends AXmlBuildProcessor {

    public ReceiptRnsRequestXmlProcessor(RequestProcessor requestProcessor) {
        super(requestProcessor);
    }

    public RequestAndSources<Request> run(@NotNull ReceiptRnsRequestDto rnsRequestDto) {
        try {
            var request = new Request();

            var constPermitDateFrom = ofNullable(rnsRequestDto.getConstPermitDateFrom()).map(XmlMapper::mapCalendar);
            var constPermitDateTo = ofNullable(rnsRequestDto.getConstPermitDateTo()).map(XmlMapper::mapCalendar);
            var constPermitNumber = ofNullableString(rnsRequestDto.getConstPermitNumber());

            // запрос списка
            if (constPermitDateFrom.isPresent() && constPermitDateTo.isPresent()) {
                var recipList = new ReceiptListConstructionType();
                constPermitDateFrom.ifPresent(recipList::setConstPermitDateFrom);
                constPermitDateTo.ifPresent(recipList::setConstPermitDateTo);
                request.setReceiptListConstruction(recipList);

                // запрос одной записи
            } else if (constPermitNumber.isPresent()) {
                var recip = new ReceiptConstructionType();
                constPermitNumber.ifPresent(recip::setConstPermitNumber);
                request.setReceiptConstruction(recip);
            } else {
                throw new SmevRequestException("request is bad. no params");
            }

            return buildRequest(request);
        } catch (Exception e) {
            throw new SmevRequestException("Ошибка при построении запрос в СМЭВ: " + e.getMessage());
        }
    }
}
