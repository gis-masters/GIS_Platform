package ru.mycrg.gis.service.validation;

import ru.mycrg.common.ValidationMqResponse;
import ru.mycrg.gis.dto.ValidationRequestDto;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface IValidationService {

    CompletableFuture<ValidationMqResponse> initValidation(String userName, List<ValidationRequestDto> request);

    CompletableFuture<ValidationMqResponse> getCommonInfo(String userName, ValidationRequestDto request);

    CompletableFuture<ValidationMqResponse> getResults(ValidationRequestDto request, int page, int size, String userName);

    void progress(ValidationMqResponse response);

}
