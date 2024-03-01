package ru.mycrg.data_service.dto.smev3;

public class TerminateRnsRequestDto implements ISmevRequestDto{

    private Long recId;
    private Boolean sendToSmev = true;

    public Long getRecId() {
        return recId;
    }

    public TerminateRnsRequestDto setRecId(Long recId) {
        this.recId = recId;
        return this;
    }

    public Boolean sendToSmev() {
        return sendToSmev;
    }

    public TerminateRnsRequestDto setSendToSmev(Boolean sendToSmev) {
        this.sendToSmev = sendToSmev;
        return this;
    }
}
