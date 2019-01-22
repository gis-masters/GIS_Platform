package ru.geoserver.service.validation;

import ru.mycrg.common.ConstraintViolation;
import ru.mycrg.common.EntityTypeDto;

import java.util.List;
import java.util.Map;

public interface IValidator {

    List<ConstraintViolation> validate(EntityTypeDto entityType, Map<String, String> data);

}
