package ru.mycrg.data_service.dto.smev3;

public class TerminateRnsRequestDto implements ISmevRequestDto {

    private Long recId;
    private Boolean sendToSmev = true;
    private String stubSmevResponse;

    public Long getRecId() {
        return recId;
    }

    public TerminateRnsRequestDto setRecId(Long recId) {
        this.recId = recId;
        return this;
    }

    @Override
    public Boolean isSendToSmev() {
        return sendToSmev;
    }

    @Override
    public String getStubSmevResponse() {
        return stubSmevResponse;
    }
}
