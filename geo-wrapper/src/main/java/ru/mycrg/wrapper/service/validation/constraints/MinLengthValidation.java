package ru.mycrg.wrapper.service.validation.constraints;

import ru.mycrg.common.SimplePropertyDto;

public class MinLengthValidation implements CrgConstraintValidator {

    @Override
    public boolean isValid(Object value, SimplePropertyDto context) {
        if (value == null || context.getMinLength() == -1) {
            return true;
        }

        return value.toString().length() >= context.getMinLength();
    }
}
