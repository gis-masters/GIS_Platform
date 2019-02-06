package ru.mycrg.wrapper.service.validation.constraints;

import ru.mycrg.common.SimplePropertyDto;

public class IsDoubleTypeValidation implements CrgConstraintValidator {

    @Override
    public boolean isValid(Object value, SimplePropertyDto context) {
        if (value == null) {
            return true;
        }

        try {
            Double.valueOf(String.valueOf(value));

            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }
}
