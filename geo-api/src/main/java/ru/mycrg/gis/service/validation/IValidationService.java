package ru.mycrg.gis.service.validation;

import ru.mycrg.common.ValidationResponse;
import ru.mycrg.gis.dto.ValidationRequestDto;

import java.util.List;

public interface IValidationService {

    void initValidation(String userName, List<ValidationRequestDto> request);

    void progress(ValidationResponse response);
}
