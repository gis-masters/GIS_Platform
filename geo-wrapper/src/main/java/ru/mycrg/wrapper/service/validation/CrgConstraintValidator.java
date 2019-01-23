package ru.mycrg.wrapper.service.validation;

import ru.mycrg.common.SimplePropertyDto;

import java.util.Optional;

public interface CrgConstraintValidator {

    boolean isValid(Object value, SimplePropertyDto context);
}
