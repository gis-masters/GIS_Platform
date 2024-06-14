package ru.mycrg.data_service.dto.smev3;

public class RegisterRnvRequestDto implements ISmevRequestDto {

    private Long recId;

    public Long getRecId() {
        return recId;
    }

    public RegisterRnvRequestDto setRecId(Long recId) {
        this.recId = recId;
        return this;
    }
}
