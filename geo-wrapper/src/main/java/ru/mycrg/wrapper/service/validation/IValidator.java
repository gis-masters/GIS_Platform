package ru.mycrg.wrapper.service.validation;

import ru.mycrg.common.ConstraintViolation;
import ru.mycrg.common.EntityTypeDto;

import java.util.Map;

public interface IValidator {

    ConstraintViolation validate(EntityTypeDto entityType, Map<String, Object> data);

}
