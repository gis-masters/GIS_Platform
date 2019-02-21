package ru.mycrg.gis.service.validation;

import ru.mycrg.common.ValidationMqResponse;
import ru.mycrg.common.enums.RequstType;
import ru.mycrg.gis.dto.ValidationRequestDto;
import ru.mycrg.gis.dto.ValidationResponseDto;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface IValidationService {

    CompletableFuture<List<ValidationResponseDto>> initProcess(String userName, List<ValidationRequestDto> request,
                                                               int page, int size, RequstType type);

    void progress(ValidationMqResponse response);

}
