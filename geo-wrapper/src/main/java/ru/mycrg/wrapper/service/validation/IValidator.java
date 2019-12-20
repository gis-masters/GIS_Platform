package ru.mycrg.wrapper.service.validation;

import ru.mycrg.mq_queue_contract.FeatureDescriptionDto;
import ru.mycrg.mq_queue_contract.ObjectValidationResult;

import java.util.Map;

public interface IValidator {

    ObjectValidationResult validate(FeatureDescriptionDto featureDescriptionDto, Map<String, Object> data);

}
