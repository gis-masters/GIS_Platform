package ru.mycrg.data_service.dto.smev3;

public class RegisterRnvRequestDto {
    private Long recId;
    private Boolean sendToSmev = true;
    private Boolean stubFields = false;
    private Boolean stubAttachments = false;

    public Long getRecId() {
        return recId;
    }

    public RegisterRnvRequestDto setRecId(Long recId) {
        this.recId = recId;
        return this;
    }

    public Boolean getSendToSmev() {
        return sendToSmev;
    }

    public RegisterRnvRequestDto setSendToSmev(Boolean sendToSmev) {
        this.sendToSmev = sendToSmev;
        return this;
    }

    public Boolean getStubFields() {
        return stubFields;
    }

    public RegisterRnvRequestDto setStubFields(Boolean stubFields) {
        this.stubFields = stubFields;
        return this;
    }

    public Boolean getStubAttachments() {
        return stubAttachments;
    }

    public RegisterRnvRequestDto setStubAttachments(Boolean stubAttachments) {
        this.stubAttachments = stubAttachments;
        return this;
    }
}
