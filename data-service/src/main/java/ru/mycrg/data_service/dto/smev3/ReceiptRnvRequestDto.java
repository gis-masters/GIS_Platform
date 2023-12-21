package ru.mycrg.data_service.dto.smev3;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;

import static ru.mycrg.data_service.config.CrgCommonConfig.SYSTEM_DATE_PATTERN;

public class ReceiptRnvRequestDto {
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = SYSTEM_DATE_PATTERN)
    private LocalDate permitDate;

    private Boolean sendToSmev = true;

    public LocalDate getPermitDate() {
        return permitDate;
    }

    public ReceiptRnvRequestDto setPermitDate(LocalDate permitDate) {
        this.permitDate = permitDate;
        return this;
    }

    public Boolean getSendToSmev() {
        return sendToSmev;
    }

    public ReceiptRnvRequestDto setSendToSmev(Boolean sendToSmev) {
        this.sendToSmev = sendToSmev;
        return this;
    }
}
