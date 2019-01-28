package ru.mycrg.gis.service.validation;

import ru.mycrg.gis.dto.ValidationRequestDto;

import java.util.UUID;

class RegistrationInfo {
    private UUID id;
    private ValidationRequestDto requestDto;

    public RegistrationInfo(UUID id, ValidationRequestDto requestDto) {
        this.id = id;
        this.requestDto = requestDto;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public ValidationRequestDto getRequestDto() {
        return requestDto;
    }

    public void setRequestDto(ValidationRequestDto requestDto) {
        this.requestDto = requestDto;
    }
}
