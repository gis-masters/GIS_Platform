package ru.mycrg.wrapper.service.validation.constraints;

import ru.mycrg.common.SimplePropertyDto;

public class TotalDigitsValidation implements CrgConstraintValidator {

    @Override
    public boolean isValid(Object value, SimplePropertyDto context) {
        if (value == null || context.getTotalDigits() == -1) {
            return true;
        }

        return String.valueOf(value).length() <= context.getTotalDigits();
    }
}
