package ru.mycrg.gis.service.validation;

import ru.mycrg.gis.service.fgistp.EntityType;

import java.util.List;
import java.util.Map;

public interface IValidator {

    List<ConstraintViolationImpl> validate(EntityType entityType, Map<String, String> data);

}
