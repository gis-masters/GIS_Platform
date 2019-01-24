package ru.mycrg.gis.service.validation;

import ru.mycrg.common.ValidationResponse;

public interface IValidationService {

    void initValidation(String className);

    void progress(ValidationResponse response);
}
