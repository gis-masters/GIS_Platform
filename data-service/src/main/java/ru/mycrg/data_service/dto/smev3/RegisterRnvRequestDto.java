package ru.mycrg.data_service.dto.smev3;

public class RegisterRnvRequestDto implements ISmevRequestDto {
    private Long recId;
    private Boolean isSendToSmev = true;
    private String stubSmevResponse;

    public Long getRecId() {
        return recId;
    }

    public RegisterRnvRequestDto setRecId(Long recId) {
        this.recId = recId;
        return this;
    }

    @Override
    public Boolean isSendToSmev() {
        return isSendToSmev;
    }

    @Override
    public String getStubSmevResponse() {
        return stubSmevResponse;
    }
}
