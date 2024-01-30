package ru.mycrg.data_service.dto.smev3;

public class RegisterRnsRequestDto implements ISmevRequestDto{
    private Long recId;
    private Boolean sendToSmev = true;
    private Boolean stubFields = false;
    private Boolean stubAttachments = false;

    public Long getRecId() {
        return recId;
    }

    public RegisterRnsRequestDto setRecId(Long recId) {
        this.recId = recId;
        return this;
    }

    public Boolean sendToSmev() {
        return sendToSmev;
    }

    public RegisterRnsRequestDto setSendToSmev(Boolean sendToSmev) {
        this.sendToSmev = sendToSmev;
        return this;
    }

    public Boolean getStubFields() {
        return stubFields;
    }

    public RegisterRnsRequestDto setStubFields(Boolean stubFields) {
        this.stubFields = stubFields;
        return this;
    }

    public Boolean getStubAttachments() {
        return stubAttachments;
    }

    public RegisterRnsRequestDto setStubAttachments(Boolean stubAttachments) {
        this.stubAttachments = stubAttachments;
        return this;
    }
}
