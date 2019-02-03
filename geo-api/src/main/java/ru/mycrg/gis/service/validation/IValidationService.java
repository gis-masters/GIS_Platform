package ru.mycrg.gis.service.validation;

import ru.mycrg.common.ValidationMqResponse;
import ru.mycrg.gis.dto.ValidationRequestDto;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface IValidationService {

    void initValidation(String userName, List<ValidationRequestDto> request);

    void progress(ValidationMqResponse response);

    CompletableFuture<ValidationMqResponse> getResults(ValidationRequestDto request, int page, int size, String userName);
}
