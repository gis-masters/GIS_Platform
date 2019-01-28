package ru.mycrg.wrapper.service.validation.constraints;

import ru.mycrg.common.SimplePropertyDto;

public interface CrgConstraintValidator {

    boolean isValid(Object value, SimplePropertyDto context);
}
