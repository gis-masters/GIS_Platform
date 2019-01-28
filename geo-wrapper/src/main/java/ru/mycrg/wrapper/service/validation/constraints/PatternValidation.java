package ru.mycrg.wrapper.service.validation.constraints;

import ru.mycrg.common.SimplePropertyDto;

public class PatternValidation implements CrgConstraintValidator {

    @Override
    public boolean isValid(Object value, SimplePropertyDto context) {
        if (value == null || context.getPattern() == null) {
            return true;
        }

        return value.toString().matches(context.getPattern());
    }
}
