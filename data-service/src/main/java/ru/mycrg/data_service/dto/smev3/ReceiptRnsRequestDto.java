package ru.mycrg.data_service.dto.smev3;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;

import static ru.mycrg.data_service.config.CrgCommonConfig.SYSTEM_DATE_PATTERN;

public class ReceiptRnsRequestDto implements ISmevRequestDto {
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = SYSTEM_DATE_PATTERN)
    private LocalDate constPermitDateFrom;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = SYSTEM_DATE_PATTERN)
    private LocalDate constPermitDateTo;

    private String constPermitNumber;

    private Boolean sendToSmev = true;

    //TODO временно
    private String testBase64;

    public LocalDate getConstPermitDateFrom() {
        return constPermitDateFrom;
    }

    public ReceiptRnsRequestDto setConstPermitDateFrom(LocalDate constPermitDateFrom) {
        this.constPermitDateFrom = constPermitDateFrom;
        return this;
    }

    public LocalDate getConstPermitDateTo() {
        return constPermitDateTo;
    }

    public ReceiptRnsRequestDto setConstPermitDateTo(LocalDate constPermitDateTo) {
        this.constPermitDateTo = constPermitDateTo;
        return this;
    }

    public Boolean sendToSmev() {
        return sendToSmev;
    }

    public String getConstPermitNumber() {
        return constPermitNumber;
    }

    public ReceiptRnsRequestDto setSendToSmev(Boolean sendToSmev) {
        this.sendToSmev = sendToSmev;
        return this;
    }

    public String getTestBase64() {
        return testBase64;
    }
}
