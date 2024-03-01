package ru.mycrg.data_service.dto.smev3;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;

import static ru.mycrg.data_service.config.CrgCommonConfig.SYSTEM_DATE_PATTERN;

public class ReceiptRnvRequestDto implements ISmevRequestDto {
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = SYSTEM_DATE_PATTERN)
    private LocalDate permitDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = SYSTEM_DATE_PATTERN)
    private LocalDate permitDateFrom;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = SYSTEM_DATE_PATTERN)
    private LocalDate permitDateTo;
    private String permitNumber;
    private String docId;
    private Boolean sendToSmev = true;
    //TODO временно
    private String testBase64;

    public LocalDate getPermitDate() {
        return permitDate;
    }

    public ReceiptRnvRequestDto setPermitDate(LocalDate permitDate) {
        this.permitDate = permitDate;
        return this;
    }

    public LocalDate getPermitDateFrom() {
        return permitDateFrom;
    }

    public ReceiptRnvRequestDto setPermitDateFrom(LocalDate permitDateFrom) {
        this.permitDateFrom = permitDateFrom;
        return this;
    }

    public LocalDate getPermitDateTo() {
        return permitDateTo;
    }

    public ReceiptRnvRequestDto setPermitDateTo(LocalDate permitDateTo) {
        this.permitDateTo = permitDateTo;
        return this;
    }

    public String getPermitNumber() {
        return permitNumber;
    }

    public ReceiptRnvRequestDto setPermitNumber(String permitNumber) {
        this.permitNumber = permitNumber;
        return this;
    }

    public String getDocId() {
        return docId;
    }

    public ReceiptRnvRequestDto setDocId(String docId) {
        this.docId = docId;
        return this;
    }

    public String getTestBase64() {
        return testBase64;
    }

    public ReceiptRnvRequestDto setTestBase64(String testBase64) {
        this.testBase64 = testBase64;
        return this;
    }

    @Override
    public Boolean sendToSmev() {
        return sendToSmev;
    }
}
