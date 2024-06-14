package ru.mycrg.data_service.dto.smev3;

public class TerminateRnsRequestDto implements ISmevRequestDto {

    private Long recId;

    public Long getRecId() {
        return recId;
    }

    public TerminateRnsRequestDto setRecId(Long recId) {
        this.recId = recId;
        return this;
    }
}
