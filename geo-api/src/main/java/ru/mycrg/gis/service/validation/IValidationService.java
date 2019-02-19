package ru.mycrg.gis.service.validation;

import ru.mycrg.common.ValidationMqResponse;
import ru.mycrg.gis.dto.ValidationRequestDto;
import ru.mycrg.gis.dto.ValidationResponseDto;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface IValidationService {

    CompletableFuture<List<ValidationResponseDto>> initValidation(String userName, List<ValidationRequestDto> request);

    CompletableFuture<List<ValidationResponseDto>> getCommonInfo(String userName, ValidationRequestDto request);

    CompletableFuture<List<ValidationResponseDto>> getResults(ValidationRequestDto request, int page, int size, String userName);

    void progress(ValidationMqResponse response);

}
