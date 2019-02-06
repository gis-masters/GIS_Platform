package ru.mycrg.wrapper.service.validation;

import ru.mycrg.common.ObjectValidationResult;
import ru.mycrg.common.EntityTypeDto;

import java.util.Map;

public interface IValidator {

    ObjectValidationResult validate(EntityTypeDto entityType, Map<String, Object> data);

}
