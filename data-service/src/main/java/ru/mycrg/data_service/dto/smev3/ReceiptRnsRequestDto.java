package ru.mycrg.data_service.dto.smev3;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;

import static ru.mycrg.data_service.config.CrgCommonConfig.SYSTEM_DATE_PATTERN;

public class ReceiptRnsRequestDto {
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = SYSTEM_DATE_PATTERN)
    private LocalDate constPermitDateFrom;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = SYSTEM_DATE_PATTERN)
    private LocalDate constPermitDateTo;

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
}
