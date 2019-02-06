package ru.mycrg.wrapper.service.validation.constraints;

import ru.mycrg.common.SimplePropertyDto;

public class MaxLengthValidation implements CrgConstraintValidator {

    @Override
    public boolean isValid(Object value, SimplePropertyDto context) {
        if (value == null || context.getMaxLength() == -1) {
            return true;
        }

        return value.toString().length() < context.getMaxLength();
    }
}
