package ru.mycrg.gis.service.validation;

import ru.mycrg.common.ValidationMqResponse;
import ru.mycrg.gis.dto.ValidationRequestDto;

import java.util.List;

public interface IValidationService {

    void initValidation(String userName, List<ValidationRequestDto> request);

    void progress(ValidationMqResponse response);
}
