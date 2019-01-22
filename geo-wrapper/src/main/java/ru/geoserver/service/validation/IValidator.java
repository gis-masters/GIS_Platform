package ru.geoserver.service.validation;

import ru.mycrg.common.ConstraintViolation;
import ru.mycrg.common.EntityType;

import java.util.List;
import java.util.Map;

public interface IValidator {

    List<ConstraintViolation> validate(EntityType entityType, Map<String, String> data);

}
