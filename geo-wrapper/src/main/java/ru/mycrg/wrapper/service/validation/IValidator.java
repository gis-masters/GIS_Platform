package ru.mycrg.wrapper.service.validation;

import ru.mycrg.common.ObjectValidationResult;
import ru.mycrg.common.FeatureDescriptionDto;

import java.util.Map;

public interface IValidator {

    ObjectValidationResult validate(FeatureDescriptionDto featureDescriptionDto, Map<String, Object> data);

}
