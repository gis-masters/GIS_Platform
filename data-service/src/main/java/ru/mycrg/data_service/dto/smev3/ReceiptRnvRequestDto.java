package ru.mycrg.data_service.dto.smev3;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;

import static ru.mycrg.data_service.config.CrgCommonConfig.SYSTEM_DATE_PATTERN;

public class ReceiptRnvRequestDto {
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = SYSTEM_DATE_PATTERN)
    private LocalDate permitDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = SYSTEM_DATE_PATTERN)
    private LocalDate permitDateFrom;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = SYSTEM_DATE_PATTERN)
    private LocalDate permitDateTo;
    private String permitNumber;
    private String docId;
    private Boolean sendToSmev = true;

    public LocalDate getPermitDate() {
        return permitDate;
    }

    public LocalDate getPermitDateFrom() {
        return permitDateFrom;
    }

    public LocalDate getPermitDateTo() {
        return permitDateTo;
    }

    public String getPermitNumber() {
        return permitNumber;
    }

    public String getDocId() {
        return docId;
    }

    public Boolean getSendToSmev() {
        return sendToSmev;
    }
}
